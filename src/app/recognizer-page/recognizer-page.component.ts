import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpeechkitService } from '../shared/speechkit.service';
import { BehaviorSubject } from 'rxjs';
import { SemanticAnalyserService } from '../shared/semantic-analyser.service';
import { KeywordSpottingService } from '../shared/keyword-spotting.service';
import { UISoundPlayerService } from '../shared/ui-sound-player.service';
import { ClapDetectorSevice } from '../shared/clap-detector.service';

@Component({
  selector: 'app-recognizer-page',
  templateUrl: './recognizer-page.component.html',
  styleUrls: ['./recognizer-page.component.styl']
})
export class RecognizerPageComponent implements OnInit {

  constructor(
    private stt: SpeechkitService,
    private semantic: SemanticAnalyserService,
    private sound: UISoundPlayerService,
    private ref: ChangeDetectorRef,
    private spotter: ClapDetectorSevice
    ) { }

  recogRes;
  recogResFancy;
  isRecognizing;
  isWasInput = false;
  speechkit: BehaviorSubject<any>;

  ngOnInit() {
    this.initSpeechkit();
    this.initSpotter();
    this.sound.load();
  }


  initSpeechkit() {
    this.speechkit = this.stt.init(true, false);
    this.speechkit.subscribe((data) => {
      if (data.final) {
        this.onRecognitionFinished(data);
      } else {
        this.onRecognitionProcessing(data);
      }
    });
  }

  initSpotter() {
    this.spotter.claps.subscribe((claps) => this.onSpottedClap(claps));
    this.spotter.actionDetected.subscribe((flag) => {
      if (flag) {
        this.onSpottedAction();
      };
    });
    this.spotter.startRecognition(true);
  }



  startRecognition() {
    this.stt.startRecognition();
    this.noRecognitionStarted();
  }

  noRecognitionStarted() {
    this.sound.play(4);
    this.recogRes = "";
    this.isRecognizing = true;
    this.isWasInput = false;
    this.ref.detectChanges();
  }

  onRecognitionProcessing(data) {
    this.recogRes = this.semantic.improveString(data.hip);
    this.recogResFancy = this.semantic.analyseString(data.hip);
    console.log(this.semantic.analyseString(data.hip));
    this.isWasInput = true;
    this.ref.detectChanges();
  }

  onRecognitionFinished(data) {
    this.spotter.startRecognition(true);
    this.recogRes = this.semantic.improveString(data.hip);
    this.recogResFancy = this.semantic.analyseString(data.hip);
    console.log(this.semantic.analyseString(data.hip));
    this.isRecognizing = false;
    if (this.isWasInput) {
      this.onRecognitionSucceeded(data);
    } else {
      this.onRecognitionFailed(data);
    }
    this.ref.detectChanges();
  }

  onRecognitionFailed(data) {
    this.sound.play(2);
  }
  onRecognitionSucceeded(data) {
    this.sound.play(1);
  }

  onSpottedClap(claps) {
    console.log(claps);

  }

  onSpottedAction() {
    console.log("action!");
    this.startRecognition();
  }


  ngOnDestroy() {
    this.speechkit.unsubscribe();
  }

}
