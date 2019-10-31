import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClapDetectorSevice } from '../shared/clap-detector.service';
import {TweenMax, Power2, TimelineLite} from 'gsap/TweenMax';
import { SpeechkitService } from '../shared/speechkit.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.styl']
})
export class MainPageComponent implements OnInit {

  constructor(private cd: ClapDetectorSevice, private stt: SpeechkitService, private ref: ChangeDetectorRef) { }

  startRecognitionBtnLabel = 'Запустить распознавание';

  claps: boolean[];

  isRecording = false;

  ngOnInit() {
    this.claps = [];

    this.cd.claps.subscribe((claps) => {
      for (let i = 0; i < this.cd.config.clapsSequenceSize; i++) {
        this.claps[i] = claps - 1 >= i;

      }
      this.ref.detectChanges();
      if(this.claps[0]) {
        TweenMax.to(document.getElementsByClassName('bg'), 0.5, {'background-color': '#ffffff'});
      }
      console.log(this.claps);
    });




    this.cd.actionDetected.subscribe((action) => {

      if(action) {
        TweenMax.to(document.getElementsByClassName('bg'), 0.1, {'background-color': '#9eff13'});
      }

    });
  }

  startRecognition() {
    TweenMax.to(document.getElementsByClassName('bg'), 0, {'background-color': '#ffffff'});
    this.startRecognitionBtnLabel = 'Распознавание работает';
    this.cd.startRecognition(true);
  }

  startRecord() {
    this.stt.start();
    this.isRecording = true;
  }
  stopRecord() {
    this.stt.stop();
    this.isRecording = false;
  }

}
