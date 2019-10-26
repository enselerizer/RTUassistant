import { Component, OnInit } from '@angular/core';
import { ClapdetectSevice } from '../shared/clapdetect.service';

@Component({
  selector: 'app-stt-field',
  templateUrl: './stt-field.component.html',
  styleUrls: ['./stt-field.component.styl']
})
export class SttFieldComponent implements OnInit {

  constructor(private clapd: ClapdetectSevice) { }


  ngOnInit() {

  }



}
