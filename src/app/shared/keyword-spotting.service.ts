import { Injectable } from '@angular/core';
import * as Sphinx from 'node-sphinx';

declare var electron: any;

@Injectable({
  providedIn: 'root'
})
export class KeywordSpottingService {
  init(logging = true) {
    electron.ipcRenderer.send('SpotterInit', {logging: logging});
  }

  startRecognition() {
    electron.ipcRenderer.send('SpotterStartRecognition');
  }
}
