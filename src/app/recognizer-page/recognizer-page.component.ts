import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpeechkitService } from '../shared/speechkit.service';
import { BehaviorSubject } from 'rxjs';
import { SemanticAnalyserService } from '../shared/semantic-analyser.service';

@Component({
  selector: 'app-recognizer-page',
  templateUrl: './recognizer-page.component.html',
  styleUrls: ['./recognizer-page.component.styl']
})
export class RecognizerPageComponent implements OnInit {

  constructor(private stt: SpeechkitService, private semantic: SemanticAnalyserService, private ref: ChangeDetectorRef) { }

  recogRes;
  isRecognizing;
  speechkit: BehaviorSubject<any>;

  ngOnInit() {
    this.speechkit = this.stt.init(true, false);
    this.speechkit.subscribe((data) => {
      this.recogRes = this.semantic.improveString(data.hip);
      console.log(this.semantic.analyseString(data.hip));
      if (data.final) {
        this.isRecognizing = false;
      }
      this.ref.detectChanges();
    });
  }

  startRec() {
    this.stt.startRecognition();
    this.recogRes = "";
    this.isRecognizing = true;


  }

  ngOnDestroy() {
    this.speechkit.unsubscribe();
  }

}
