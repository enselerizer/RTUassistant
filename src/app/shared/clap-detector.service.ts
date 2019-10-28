import { Injectable } from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import * as $ from 'jquery';
import { BehaviorSubject } from 'rxjs';



export class ClapDetectorConfig {
  public fftSize: number;
  public detectionFftCol: number;
  public detectionSensitivity: number;
  public smoothing: number;
  public clapsSequenceSize: number;
  public spacingSize: number;
  public spacingRange: number;

  constructor(fftSize, detectionFftCol, detectionSensitivity, smoothing, clapsSequenceSize, spacingSize, spacingRange) {
    this.fftSize = fftSize;
    this.detectionFftCol = detectionFftCol;
    this.detectionSensitivity = detectionSensitivity;
    this.smoothing = smoothing;
    this.clapsSequenceSize = clapsSequenceSize;
    this.spacingSize = spacingSize;
    this.spacingRange = spacingRange;
  }
}


@Injectable({
  providedIn: 'root'
})

export class ClapDetectorSevice {
  constructor(private audioContext: AudioContext) {}


  config = new ClapDetectorConfig(32, 8, 15, 0.2, 3, 0.7, 0.3);


  cols: Uint8Array;
  claps: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  actionDetected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  clapDetectBuffer: boolean;
  clapDetectLastTime = 0;
  stopRecognitionFlag = false;
  isRecognitionWorking = false;


  async startRecognition(autoStopRecognition: boolean = false) {

    if (!this.isRecognitionWorking) {
      this.isRecognitionWorking = true;
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      navigator.getUserMedia(
          { audio: true, video: false },
          (stream) => {
              const source = this.audioContext.createMediaStreamSource(stream);
              const analyser = this.audioContext.createAnalyser();
              analyser.fftSize = this.config.fftSize;
              analyser.smoothingTimeConstant = this.config.smoothing;
              source.connect(analyser);
              const Loop: () => void = () => {
                setTimeout(() => {
                  this.cols = new Uint8Array(analyser.frequencyBinCount);
                  analyser.getByteFrequencyData(this.cols);
                  if (this.cols[this.config.detectionFftCol] >= this.config.detectionSensitivity && !this.clapDetectBuffer) {
                    if (this.claps.getValue() === 0) {
                      this.setClaps(1);
                    } else {
                      if (this.checkTimeInterval()) {
                        this.setClaps(this.claps.getValue() + 1);
                        if(this.claps.getValue() >= this.config.clapsSequenceSize) {
                          this.setActionDetected();
                          this.setClaps(0);
                          if (!autoStopRecognition) {
                            this.stopRecognition();
                          }
                        }
                      } else {
                        this.setClaps(0);
                      }
                    }
                    this.setTimeInterval();
                  }
                  this.clapDetectBuffer = this.cols[8] >= 20;
                  if (!this.stopRecognitionFlag) {
                    Loop();
                  } else {
                    this.setClaps(0);
                    this.stopRecognitionFlag = false;
                  }
                }, 20);
              };
              Loop();
          },
          (error) => {}
      );
    }
  }

  stopRecognition() {
    this.stopRecognitionFlag = true;
  }

  setTimeInterval() {
    this.clapDetectLastTime = this.audioContext.currentTime;
  }

  getTimeInterval(): number {
    return this.audioContext.currentTime - this.clapDetectLastTime;
  }

  checkTimeInterval(): boolean {
    return (this.getTimeInterval() <= this.config.spacingSize + this.config.spacingRange) &&
    (this.getTimeInterval() >= this.config.spacingSize - this.config.spacingRange);
  }

  setClaps(newClaps: number) {
    this.claps.next(newClaps);
  }

  setActionDetected() {
    this.actionDetected.next(true);
  }

}


