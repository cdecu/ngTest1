import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {MaterialModule, MaterialRootModule} from '@angular/material';
import {DatepickerModule} from 'angular2-material-datepicker';

import {XmppWebsocket} from 'rmx.xmpp.utils/src/xmpp-websocket';

import {AppComponent} from './app.component';
import {WindowRef} from './windowRef';
import {AnswerWaitComponent} from './answer-wait/answer-wait.component';
import {AnswerErrorComponent} from './answer-error/answer-error.component';
import {AnswerComponent} from './answer/answer.component';
import {AppService} from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    AnswerWaitComponent,
    AnswerErrorComponent,
    AnswerComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    MaterialRootModule,
    DatepickerModule,
    BrowserAnimationsModule
  ],
  providers: [
    XmppWebsocket,
    WindowRef,
    AppService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
