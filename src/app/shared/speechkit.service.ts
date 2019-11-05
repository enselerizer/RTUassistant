import { Injectable } from '@angular/core';
import * as Recorder from '../../../ogg-recorder/recorder.min.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

declare var electron: any;
declare const Buffer;


export class SpeechkitAuthConfig {

}



@Injectable({
  providedIn: 'root'
})

export class SpeechkitService {

  recorder: Recorder;
  isFinal = false;


  constructor(private http: HttpClient) {}

  init() {
    electron.ipcRenderer.send('SpeechkitInit');
  }

  startRecognition() {

    electron.ipcRenderer.on('log', (event, data) => {
      console.log(data.msg);
    });


    electron.ipcRenderer.send('SpeechkitStartRecognition');
    electron.ipcRenderer.once('SpeechkitRecognitionStarted', (event, data) => {
      this.recorder = new Recorder({
        monitorGain: 0,
        recordingGain: 1,
        numberOfChannels: 1,
        wavBitDepth: 16,
        encoderPath: './assets/ogg-recorder/encoderWorker.min.js',
        streamPages: true
      });
      this.recorder.ondataavailable = ( typedArray ) => {
        electron.ipcRenderer.send('SpeechkitUploadChunk', {
          chunk: Buffer.from(typedArray.buffer),
          final: this.isFinal
        });
        this.isFinal = false;
      };
      this.recorder.start();
    });

    electron.ipcRenderer.on('SpeechkitRecognitionResult', (event, data) => {
      console.log(data.alternatives[0].text, data.final ? " --- ФИНАЛ" : "");
    });
  }

  stopRecognition() {
    this.isFinal = true;
    this.recorder.stop();
  }







}
