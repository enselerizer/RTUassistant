import { Injectable } from '@angular/core';
import * as Recorder from '../../../ogg-recorder/recorder.min.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export class SpeechkitAuthConfig {
  public serviceAccountId = 'ajepg0mjt06siua65usm';
  public keyId = 'lfkoe35hsk58aks301nl';
  public keyPrivate = '-----BEGIN PRIVATE KEY-----' +
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJ0P18zbJllC/U' +
  'L8lBtkV0lEhNf8vYqw2+NX1/TFYW5TKlKMYGX1MP5+VwnXILxaFzyGTSkPIrIT+i' +
  'HtXoWvy5lonKJWnEfdVsrKT4bvn/cf7p8bxf7ljwMquKKJxT/TOZLr4FolQutYfZ' +
  'yoMFlTllab3An9GTMVCEeJjbPrWS8vNLiHARUQiLzHivedVFHV0kUBftvWb8CGq6' +
  'WVgmtCUlpDLOyNDDwmhPb7dYltKnfCiBFCrpRGO23Yrjx6n2qkPOPQQ7i7sBcjjS' +
  'F2NenGTlI1UlpmEiNt0D1+wthUCoCZqMLrtmAg4eJwJ5adN/b2ZpeIPD0VsUr30v' +
  'Q4o9hGGVAgMBAAECggEACpcT5iupE9l91QWY6wDUjjSFwsNVAA6hzvxhlH99+P+X' +
  '88C6+3SfGDOT/5/Tbzi0qy211LLUclzxSOGTWfkET/zNSDVEYpIz09sPYRX5umTR' +
  '+pa7ytDoC9qs07gj0+hyf7RLNmJ5RmYyNcSBsZZOB7tPwL7iMXYiAoGNi9uzjX1o' +
  'VYMLjo9J87CLMAMS4JNl8W6KKJTJlRJjR3IEp3kRz6gbgTYlWC5ggiX/fdu7gbRo' +
  '3Ycd/C8q7CF79S7rYFv0yhOgW6tOEygg1Jtzbz48snbkG5FoyspdlS8BEQBQh2z+' +
  '0KqxFi72hH1s/8d3nRvYaEQUxABeQCHkjHBLCKCWgQKBgQDsNTREjnwamJieVvlr' +
  'l4zj+S/VVeOc+7QnwR2COJJ+P72K8XY04fb5hfzfMz7IkCXV6ePylYNXQTOYrXRE' +
  'xyYFbvoyZMwnWSTIOas90xamsDrfPMn1UUCC5put/kaLKt65udd4rH3YA5vO0LZC' +
  '4M3tpEUO9Ny89dRHYD9pfGMCNQKBgQDauhGwkLBqams+34RKvKe8B0jJPx86yeph' +
  'p8YjYszE1+mMAAmwxn7uaa5GQPHOSHlXbxD9y3FQsvjrr6wpKoEbKNBydXrjMx5R' +
  '8hocQ0PxOG/5QzFntQkVSmB6CLsiMObSZ8d139l3ueyunnfotsom88OlCiAlfXWM' +
  'brPFki/N4QKBgQC317EWqs9s49flZUw7sXi29vuDz5WYWU+eoW+WKvHZ0UJ1Ifoe' +
  'rsDK9L4b+oajE45fL+t6o2PWRaki693Sqi2tjPKuxkUfWwKF1FyzgdffZMptdaK6' +
  'jMLpHxOMGJxPNM6lPz+1bIuF1UkvbsJsywt8Kp6VRX+IkszlwMOaFnX5AQKBgBVV' +
  'QJRwCETYzEz9j/GaJOH58+ds+KbLOsj7jB+3azFnvaeh+U/8jDTEqfLAMtVjzDHy' +
  '6z1Vsl+klRKnt6rsMltrx6jiPHIcckCb1GAdT2sfjgxJuW/cAF7LOk2svFPBYUH0' +
  'TUf55UQAJk2Bt0BDU8Qo0lQugKQncGeaBH6om3EBAoGAVbzMvf23YwjjtQ6GvF8t' +
  'Gue1uZjNomAkpNXWRF2itJ9Iryl0qZpK+qAnFKBPuMAYvLxVRIbCg6ZbIfk1JvrU' +
  'IwezSbhLVQTQFejL0rBQNiJwSI4K6uhPfGfGcrVGRGJV7VbSDR0x5jFn1ijE30bH' +
  'cNBgl1cGXUkkE4VnfCU//30=' +
  '-----END PRIVATE KEY-----';
}



@Injectable({
  providedIn: 'root'
})

export class SpeechkitService {

  recorder: Recorder;
  IAM: string;

  constructor(private http: HttpClient) {}


  bufferToBin(buffer) {
    return Array
        .from (new Uint8Array (buffer))
        .map (b => b.toString(2).padStart(2, '0'))
        .join('');
}

  getIAM(): string {
    return this.IAM;
  }

  requestIAM() {

    let body = {jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJQUzI1NiIsImtpZCI6ImFqZWFrNzEzaWNuMmsyNDdwajY2In0.eyJpc3MiOiJhamUxcjN2Y3RydGNzdm4xaGFlNiIsImF1ZCI6Imh0dHBzOi8vaWFtLmFwaS5jbG91ZC55YW5kZXgubmV0L2lhbS92MS90b2tlbnMiLCJpYXQiOjE1NzI4ODg2MjgsImV4cCI6MTU3Mjg5MTYyOH0.AbO9zmmPouyohCm6UKg0xguVXimVhDBEOalqQRDU919iW0ioxhfzE2H06vC3lveAtEJV9lf2sk4SpPgqNShqowgXjQWIfjIk3D39g7i6k_Jma7XOpq8vaLXUGNQOoiVpGvzpTxL4hKj5-3tPQQivYLRSCJq9ZBGCZBXE90sALRx1qQiErML4SpwIP7ETWZ805FbCqmCZWWWB-_6VdeJsaU6-qv_6I2ZeOjtKhKP7NOO3BygvpwZyzdEkpmbr97GbBLcTl441MwaVRC0hoPrizQruRcQrBMorrtpmHUkZ4pqlGGs7K89HSfLNUptkT5PpOSNwJlmUatcpttcEZMlw0Q"}
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    this.http.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', body, options).subscribe((result: any) => {
      this.IAM = result.iamToken;
      console.log(this.IAM);
    });
  }


  start() {
    this.recorder = new Recorder({
      monitorGain: 0,
      recordingGain: 1,
      numberOfChannels: 1,
      wavBitDepth: 16,
      encoderPath: './assets/ogg-recorder/encoderWorker.min.js'
    });


    this.recorder.start().catch(function(e){
      console.log('Error encountered:', e.message );
    });


    this.recorder.ondataavailable = ( typedArray ) => {
      console.log(typedArray)
      const saveData = (() => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        return  (blob, fileName) => {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    });

      const dataBlob = new Blob( [typedArray]);
      const fileName = new Date().toISOString() + ".ogg";
      const url = URL.createObjectURL( dataBlob );

      const params = new HttpParams({

      });

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getIAM(),
        'Transfer-Encoding': 'chunked'
      });
      const options = { headers: headers, params: params };
      this.http.post('https://stt.api.cloud.yandex.net/speech/v1/stt:recognize', typedArray.buffer,  options).subscribe((val) => {
        console.log(val);
      });

      //saveData(dataBlob, fileName);
      //console.log(url);
    };

  }

  stop() {
    this.recorder.stop();
  }



}
