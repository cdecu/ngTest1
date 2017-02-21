import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {MaterialModule, MaterialRootModule} from '@angular/material';
//import { DatepickerModule } from 'angular2-material-datepicker'
import {XmppWebsocket} from '../lib/xmpp-websocket';

@NgModule({
  declarations: [
    AppComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    MaterialRootModule,
    //DatepickerModule
  ],
  providers: [
    XmppWebsocket
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
