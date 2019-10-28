import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SttFieldComponent } from './stt-field/stt-field.component';
import { AudioContextModule } from 'angular-audio-context';

@NgModule({
  declarations: [
    AppComponent,
    SttFieldComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    AudioContextModule.forRoot('balanced')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
