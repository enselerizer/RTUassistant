import { Injectable } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})

export class ClapdetectSevice {
  constructor(private audioContext: AudioContext) {}


  public cols: Uint8Array;
  public claps = 0;


  public  startRecognition() {
    navigator.getUserMedia(
        { audio: true, video: false },
        (stream) => {
            const source = this.audioContext.createMediaStreamSource(stream);
            const analyser = this.audioContext.createAnalyser();
            // let data;
            // let dataSource;
            analyser.fftSize = 32;
            analyser.smoothingTimeConstant = 0.2;
            source.connect(analyser);


            let theLoop: () => void = () => {
              setTimeout(() => {

                this.cols = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(this.cols);

                  if(this.cols[8] > 50) {
                    this.claps++;
                  console.log(this.cols[8]);
                  }


                  theLoop();

              }, 40);
            };
            theLoop();


        },
        (error) => {
            // error processing
        }
    );
  }

  public async beep() {
    if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
    }

    const oscillatorNode = this.audioContext.createOscillator();
    const AnalyserNode = this.audioContext.createAnalyser();

    oscillatorNode.onended = () => oscillatorNode.disconnect();
    oscillatorNode.connect(this.audioContext.destination);

    oscillatorNode.start();
    oscillatorNode.stop(this.audioContext.currentTime + 0.5);
  }

  public Claps() {
    return this.claps;
  }
}


