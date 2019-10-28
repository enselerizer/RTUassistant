import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClapDetectorSevice } from '../shared/clap-detector.service';

@Component({
  selector: 'app-stt-field',
  templateUrl: './stt-field.component.html',
  styleUrls: ['./stt-field.component.styl']
})
export class SttFieldComponent implements OnInit {

  constructor(private clapd: ClapDetectorSevice, private ref: ChangeDetectorRef) { }

  clapsVal = 0;
  actionsVal = 0;

  ngOnInit() {
    this.clapd.claps.subscribe((newClaps) => {
      this.clapsVal = newClaps;
      this.ref.detectChanges();
    });
    this.clapd.actionDetected.subscribe(() => {
      this.actionsVal++;
      this.ref.detectChanges();
    });
  }



}
