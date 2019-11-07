const url = require("url");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const sphinx = require("node-sphinx");

const { app, BrowserWindow, ipcMain } = require("electron");

let lastIAM;
let lastIAMDate;
let call;
let lastSpeechkitSender;
let lastSpotterSender;
let speechkitLogging;
let spotterLogging;

let appWindow;

function initWindow() {
  appWindow = new BrowserWindow({

    webPreferences: {
      nodeIntegration: true
    },

    resizable: true,
    icon: __dirname + "/img/logo.png",
    autoHideMenuBar: true,
    frame: false,
    fullscreen: true
  });

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/RTUAssistant/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // Initialize the DevTools.
  //appWindow.webContents.openDevTools();

  appWindow.on("closed", function() {
    appWindow = null;
  });
}

app.on("ready", initWindow);

// Close when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (appWindow === null) {
    initWindow();
  }
});

ipcMain.on("SpeechkitInit", (event, data) => {
  lastSpeechkitSender = event.sender;
  speechkitLogging = data.logging;
  log("Инициализация Speechkit", speechkitLogging);
  SpeechkitInit();
});

ipcMain.on("SpeechkitStartRecognition", (event, data) => {
  lastSpeechkitSender = event.sender;
  log("Получен запрос на установление соединения", speechkitLogging);
  SpeechkitStreamRecognitionConfigure(result => {
    log("Получен результат распознавания", speechkitLogging);
    event.sender.send("SpeechkitRecognitionResult", result);
  }).then(() => {
    log("Соединение установлено", speechkitLogging);
    event.sender.send("SpeechkitRecognitionStarted");
  });
});

ipcMain.on("SpeechkitUploadChunk", (event, data) => {
  lastSpeechkitSender = event.sender;
  log("Получен запрос на отправку чанка", speechkitLogging);
  SpeechkitStreamRecognitionSendChunk(data.chunk, data.final).then(() => {
    log("Чанк отправлен", speechkitLogging);
    event.sender.send("SpeechkitRecognitionFinished");
  });
});

ipcMain.on("SpeechkitFinalizeRecognition", (event, data) => {
  lastSpeechkitSender = event.sender;
  log("Получен запрос на финализацию соединения", speechkitLogging);
  SpeechkitStreamRecognitionFinalize().then(() => {
    event.sender.send("SpeechkitRecognitionFinalized");
  });
});




ipcMain.on("SpotterInit", (event, data) => {
  lastSpotterSender = event.sender;
  spotterLogging = data.logging;
  log("Инициализация Spotter", spotterLogging);
  SpotterInit();
});

ipcMain.on("SpotterStartRecognition", (event, data) => {
  lastSpotterSender = event.sender;
  log("Запуск поиска команды", spotterLogging);
  SpotterStartRecognition().then((res) => {
    log("Результат: ", spotterLogging);
    log(res, spotterLogging);
  });
});



function log(data, enable) {
  if (enable) lastSpeechkitSender.send('log', {msg: data});
}

function SpeechkitInit() {
  lastIAMDate = 0;
  lastIAM = "";
}

function SpeechkitSetActualIAM(iamToken) {
  lastIAMDate = Math.floor(new Date().getTime() / 1000);
  lastIAM = iamToken;
}

function SpeechkitGetActualIAM() {
  return new Promise((resolve, reject) => {
    log("Получен запрос на проверку IAM", speechkitLogging);
    if (Math.floor(new Date().getTime() / 1000) - lastIAMDate > 3200) {
      log("Токен устарел, начинаем формирование JWT", speechkitLogging);
      SpeechkitGenerateJWT().then(jwt => {
        log("JWT сформирован, производим запрос IAM", speechkitLogging);
        SpeechkitRequestIAM(jwt).then(iamToken => {
          log("Новый IAM получен", speechkitLogging);
          SpeechkitSetActualIAM(iamToken);
          resolve(lastIAM);
        });
      });
    } else {
      log("Токен актуален", speechkitLogging);
      resolve(lastIAM);
    }
  });
}

function SpeechkitGenerateJWT() {
  return new Promise((resolve, reject) => {
    var jose = require("node-jose");
    var fs = require("fs");
    var key = fs.readFileSync(require.resolve("./private.pem"));
    var serviceAccountId = "aje1r3vctrtcsvn1hae6";
    var keyId = "ajeak713icn2k247pj66";
    var now = Math.floor(new Date().getTime() / 1000);
    var payload = {
      aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
      iss: serviceAccountId,
      iat: now,
      exp: now + 3600
    };

    jose.JWK.asKey(key, "pem", { kid: keyId, alg: "PS256" }).then(result => {
      jose.JWS.createSign({ format: "compact" }, result)
        .update(JSON.stringify(payload))
        .final()
        .then(result => {
          resolve(result);
        });
    });
  });
}

function SpeechkitRequestIAM(jwt) {
  return new Promise((resolve, reject) => {
    axios
      .post("https://iam.api.cloud.yandex.net/iam/v1/tokens", { jwt: jwt })
      .then(response => {
        resolve(response.data.iamToken);
      });
  });
}

function SpeechkitStreamRecognitionConfigure(callback) {
  return new Promise((resolve, reject) => {
    const request = {
      config: {
        specification: {
          languageCode: "ru-RU",
          profanityFilter: true,
          model: "general",
          partialResults: true,
          audioEncoding: "OGG_OPUS"
        }
      }
    };

    const serviceMetadata = new grpc.Metadata();

    SpeechkitGetActualIAM().then(iamToken => {
      serviceMetadata.add("authorization", `Bearer ${iamToken}`);
      const packageDefinition = protoLoader.loadSync(
        "./yandex/cloud/ai/stt/v2/stt_service.proto",
        {
          includeDirs: ["./node_modules/google-proto-files", "."]
        }
      );
      const packageObject = grpc.loadPackageDefinition(packageDefinition);
      log(packageObject, speechkitLogging);
      const serviceConstructor =
        packageObject.yandex.cloud.ai.stt.v2.SttService;
      const grpcCredentials = grpc.credentials.createSsl(
        fs.readFileSync("./roots.pem")
      );
      const service = new serviceConstructor(
        "stt.api.cloud.yandex.net:443",
        grpcCredentials
      );
      call = service["StreamingRecognize"](serviceMetadata);
      call.write(request, () => {
        resolve();
      });

      call.on("data", response => {
        callback(response.chunks[0]);
      });
    });
  });
}

function SpeechkitStreamRecognitionSendChunk(chunkBuffer, final) {
  return new Promise((resolve, reject) => {
    if(final) {
      call.end({ audioContent: chunkBuffer }, () => {
        resolve();
      });
    } else {

      try {
        call.write({ audioContent: chunkBuffer }, () => {
          resolve();
        });
      }
      catch(e) {}
    }
  });
}


function SpotterInit() {
  return new Promise((resolve, reject) => {
    sphinx.recognizerInit(
      {
        hmm: './node_modules/node-sphinx/src/pocketsphinx/model/en-us/en-us',
        lm: './node_modules/node-sphinx/src/pocketsphinx/model/en-us/en-us.lm.bin',
        dict: './node_modules/node-sphinx/src/pocketsphinx/model/en-us/cmudict-en-us.dict'
      },
      (data, error) => {
        if (error) {
          console.log(error);
          reject();
        }
        if (data.rc !== 0) {
          console.log('Ошибка инициализации: rc=' + data.rc);
          reject();
        }
        resolve();
      }
    );
  });
}

function SpotterStartRecognition() {
  return new Promise((resolve, reject) => {
    sphinx.recognizerStart((error, data) => {
      if (error) {
        console.log(error);
        reject();
      }
      resolve(data.result);
    });
  });
}
