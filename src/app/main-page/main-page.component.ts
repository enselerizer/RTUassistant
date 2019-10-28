import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClapDetectorSevice } from '../shared/clap-detector.service';
import {TweenMax, Power2, TimelineLite} from 'gsap/TweenMax';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.styl']
})
export class MainPageComponent implements OnInit {

  constructor(private cd: ClapDetectorSevice, private ref: ChangeDetectorRef) { }

  startRecognitionBtnLabel = 'Запустить распознавание';

  claps: boolean[];

  ngOnInit() {
    this.claps = [];

    this.cd.claps.subscribe((claps) => {
      for (let i = 0; i < this.cd.config.clapsSequenceSize; i++) {
        this.claps[i] = claps - 1 >= i;

      }
      this.ref.detectChanges();
      if(this.claps[0]) {
        TweenMax.to(document.getElementById('hand1'), 0.1, {'font-size': '90pt', 'color': '#00dc00'});
        TweenMax.to(document.getElementsByClassName('bg'), 0.5, {'background-color': '#ffffff'});
      } else {
        TweenMax.to(document.getElementById('hand1'), 0.2, {'font-size': '70pt', 'color': '#000000'});
      }
      if(this.claps[1]) {
        TweenMax.to(document.getElementById('hand2'), 0.1, {'font-size': '90pt', 'color': '#00dc00'});
      } else {
        TweenMax.to(document.getElementById('hand2'), 0.2, {'font-size': '70pt', 'color': '#000000'});
      }
      if(this.claps[2]) {
        TweenMax.to(document.getElementById('hand3'), 0.1, {'font-size': '90pt', 'color': '#00dc00'});
      } else {
        TweenMax.to(document.getElementById('hand3'), 0.2, {'font-size': '70pt', 'color': '#000000'});
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

}
