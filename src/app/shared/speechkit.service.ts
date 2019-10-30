import { Injectable } from '@angular/core';
import * as Recorder from '../../../ogg-recorder/recorder.min.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SpeechkitService {

  recorder: Recorder;

  constructor(private http: HttpClient) {}





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


    this.recorder.ondataavailable = function( typedArray ){
      var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        return function (blob, fileName) {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());





      var dataBlob = new Blob( [typedArray], { type: 'audio/ogg' } );
      var fileName = new Date().toISOString() + ".ogg";
      var url = URL.createObjectURL( dataBlob );

      saveData(dataBlob, fileName);




      console.log(url);
    };

  }

  stop() {
    this.recorder.stop();
  }

  // getIAM(): Observable<any> {
  //   let body = {jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJQUzI1NiIsImtpZCI6ImFqZTgwYW01bnJhYmI4dGpzb2gyIn0.eyJpc3MiOiJhamUxcjN2Y3RydGNzdm4xaGFlNiIsImF1ZCI6Imh0dHBzOi8vaWFtLmFwaS5jbG91ZC55YW5kZXgubmV0L2lhbS92MS90b2tlbnMiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MDgyMn0.h6ikrUcaFuXhwxeZ7DMbgUD6i8a1iP4uyvjqR04GT_kSwxlZHnlZUWTMSOKuGspvda_X1GoQ_TApE-CmgDcHcLoJjP5Pk9mr7-lpfFz-0yJTYW09wpr-niZ23c-od0mryHXNotTXIAaEpSZwxrKrv7ccc2HUi4_NaM0latxUGch6G4CxWKbIOKDHQ-nxlLu7heBUuobhZoG1Qco45tCQQF0IlEVJL0qYvj3to_6c1myJYMuhOVu7luEsabo10XMKYkONfkAAGYgIDH19_rAq2I-LA6OJTPgeH6qpDPz6na__5aeqUFxA2NJOSHOSszVS09B0sXRQ3p8NkWvAiZKgaA"}
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const options = { headers: headers };
  //   return this.http.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', body, options);
  // }

  // requestIAM() {
  //   this.getIAM().subscribe((val) => {
  //     console.log(val);
  //   });
  // }



}
