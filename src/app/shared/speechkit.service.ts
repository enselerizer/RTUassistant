import { Injectable } from '@angular/core';
import * as Recorder from '../../../ogg-recorder/recorder.min.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

declare var electron: any;
declare const Buffer;

@Injectable({
  providedIn: 'root'
})
export class SpeechkitService {
  recorder: Recorder;
  initialized = false;
  isFinal = false;
  autoFinal;

  constructor(private http: HttpClient) {}

  recognition: BehaviorSubject<any> = new BehaviorSubject<any>({});

  init(autoFinal = true, logging = false) {
    if (!this.initialized) {
      this.initialized = true;
      this.autoFinal = autoFinal;
      this.recognition.next({hip: "", final: true});

      electron.ipcRenderer.send('SpeechkitInit', {logging: logging});
      this.recorder = new Recorder({
        monitorGain: 0,
        recordingGain: 1,
        numberOfChannels: 1,
        wavBitDepth: 16,
        encoderPath: './assets/ogg-recorder/encoderWorker.min.js',
        maxFramesPerPage: 10,
        resampleQuality: 0,
        streamPages: true,
        reuseWorker: true
      });
      this.recorder.loadWorker();

      this.recorder.ondataavailable = typedArray => {
        electron.ipcRenderer.send('SpeechkitUploadChunk', {
          chunk: Buffer.from(typedArray.buffer),
          final: this.isFinal
        });
        this.isFinal = false;
      };

      electron.ipcRenderer.on('log', (event, data) => {
        console.log(data.msg);
      });

      electron.ipcRenderer.on('SpeechkitRecognitionResult', (event, data) => {
        this.recognition.next({
          hip: data.alternatives[0].text,
          final: data.final
        });

        if (data.final && this.autoFinal) {
          this.stopRecognition();
        }
      });
    }
    return this.recognition;
  }

  startRecognition() {
    electron.ipcRenderer.send('SpeechkitStartRecognition');
    electron.ipcRenderer.once('SpeechkitRecognitionStarted', (event, data) => {
      this.recorder.start();
    });
    setTimeout(() => {
      if(this.recognition.getValue().hip === "") {
        this.recognition.next({hip: "", final: true});
        this.stopRecognition();
      }
    }, 4000);
  }

  stopRecognition() {
    this.isFinal = true;
    this.recorder.stop();
  }
}
