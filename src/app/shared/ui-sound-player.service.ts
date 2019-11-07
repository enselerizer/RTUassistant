import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UISoundPlayerService {

  audio;
  isLoaded = false;



  load(num) {
    this.audio = new Audio();
    this.audio.src = "./assets/sounds/ui"+num+".mp3";
    this.audio.load();
    this.isLoaded = true;

  }
  play() {
    if (this.isLoaded){
      this.audio.play();
    }
  }
}
