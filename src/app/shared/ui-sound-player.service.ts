import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UISoundPlayerService {

  audios = {
    isLoaded: false,
    items: []
  };

  load() {
    for (let i = 0; i < 4; i++) {

      this.audios.items.push(new Audio());
      this.audios.items[i].src = "./assets/sounds/ui"+(i+1)+".mp3";
      this.audios.items[i].load();
    }
    this.audios.isLoaded = true;
  }
  play(num) {
    if (this.audios.isLoaded){
      this.audios.items[num-1].play();
    }
  }
}
