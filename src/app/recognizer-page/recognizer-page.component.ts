import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpeechkitService } from '../shared/speechkit.service';
import { BehaviorSubject } from 'rxjs';
import { SemanticAnalyserService } from '../shared/semantic-analyser.service';
import { KeywordSpottingService } from '../shared/keyword-spotting.service';
import { UISoundPlayerService } from '../shared/ui-sound-player.service';

@Component({
  selector: 'app-recognizer-page',
  templateUrl: './recognizer-page.component.html',
  styleUrls: ['./recognizer-page.component.styl']
})
export class RecognizerPageComponent implements OnInit {

  constructor(private stt: SpeechkitService, private semantic: SemanticAnalyserService, private sound: UISoundPlayerService, private ref: ChangeDetectorRef) { }

  recogRes;
  recogResFancy;
  isRecognizing;
  speechkit: BehaviorSubject<any>;

  ngOnInit() {
    this.speechkit = this.stt.init(true, false);
    this.speechkit.subscribe((data) => {
      this.recogRes = this.semantic.improveString(data.hip);
      this.recogResFancy = this.semantic.analyseString(data.hip);
      console.log(this.semantic.analyseString(data.hip));
      if (data.final) {
        this.isRecognizing = false;
        this.sound.play();
        this.sound.load(4);
      } else {
        this.sound.load(3);
      }
      this.ref.detectChanges();
    });
    this.sound.load(4);
  }

  startRec() {
    this.sound.play();
    this.sound.load(2);
    this.stt.startRecognition();
    this.recogRes = "";
    this.isRecognizing = true;


  }

  ngOnDestroy() {
    this.speechkit.unsubscribe();
  }

}
