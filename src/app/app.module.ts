import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioContextModule } from 'angular-audio-context';
import { MainPageComponent } from './main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';
import { RecognizerPageComponent } from './recognizer-page/recognizer-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'



@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RecognizerPageComponent
  ],
  imports: [
    HttpClientModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AudioContextModule.forRoot('balanced')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
