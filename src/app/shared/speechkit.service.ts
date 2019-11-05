import { Injectable } from '@angular/core';
import * as Recorder from '../../../ogg-recorder/recorder.min.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export class SpeechkitAuthConfig {

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
    const headers = new HttpHeaders({});
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
      const params = new HttpParams({

      });

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getIAM()
      });
      const options = { headers: headers, params: params };
      this.http.post('https://stt.api.cloud.yandex.net/speech/v1/stt:recognize', typedArray.buffer,  options).subscribe((val) => {
        console.log(val);
      });
    };

  }

  stop() {
    this.recorder.stop();
  }



}
