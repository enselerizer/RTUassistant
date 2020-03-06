import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpeechkitService } from '../shared/speechkit.service';
import { BehaviorSubject } from 'rxjs';
import { SemanticAnalyserService } from '../shared/semantic-analyser.service';
import { KeywordSpottingService } from '../shared/keyword-spotting.service';
import { UISoundPlayerService } from '../shared/ui-sound-player.service';
import { ClapDetectorSevice } from '../shared/clap-detector.service';
import { trigger, state, style, animate, transition, group } from '@angular/animations';

@Component({
  selector: 'app-recognizer-page',
  templateUrl: './recognizer-page.component.html',
  styleUrls: ['./recognizer-page.component.styl'],
  animations: [
    trigger('stt-word', [
      transition('void => *', [
        style({opacity: 0, position: 'relative', bottom: '-10px'}),
        animate('0.3s', style({opacity: 1, bottom: '0'})),
      ])
     ])
  ]
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
  recogResFancy = {groups : []};
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
    this.clearRecognitionResult();
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

  updateRecognitionResult(analysisResult) {
    let min = Math.min(this.recogResFancy.groups.length, analysisResult.groups.length)
    let same = 1;
    let updateNeeded = false;
    for (let i = 0; i < min; i++) {
      if (this.recogResFancy.groups[i].improved !== analysisResult.groups[i].improved) {
        same = i - 1;
        updateNeeded = true;
        break;
      }
    }
    if(!updateNeeded && this.recogResFancy.groups.length !== analysisResult.groups.length) {
      updateNeeded = true;
      same = min + 1;
    }
    if(updateNeeded){
      let len;

      len = this.recogResFancy.groups.length;
      for (let i = 0; i < len - same - 1; i++) {
        this.recogResFancy.groups.pop();
      }


      len = analysisResult.groups.length;
      for (let i = same + 1; i < len; i++) {
        if(i >= 0) {
          this.recogResFancy.groups.push(analysisResult.groups[i]);
        }
      }
      console.log('Update result: ',  JSON.parse(JSON.stringify(this.recogResFancy)));
    }
  }

  clearRecognitionResult() {
    let len = this.recogResFancy.groups.length;
    for (let i = 0; i < len; i++) {
      this.recogResFancy.groups.pop();
    }
  }



  onRecognitionProcessing(data) {
    this.recogRes = this.semantic.improveString(data.hip);
    this.updateRecognitionResult(this.semantic.analyseString(data.hip));
    console.log('Analysis result: ',  this.semantic.analyseString(data.hip));
    this.isWasInput = true;
    this.ref.detectChanges();
  }

  onRecognitionFinished(data) {
    this.spotter.startRecognition(true);
    this.recogRes = this.semantic.improveString(data.hip);
    this.updateRecognitionResult(this.semantic.analyseString(data.hip));
    console.log('Analysis result: ', this.semantic.analyseString(data.hip));
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
