import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent, DialogContent} from "./app.component";
import {RouterModule} from "@angular/router";
import {MaterialModule, MaterialRootModule} from "@angular/material";
import { DatepickerModule } from 'angular2-material-datepicker'

@NgModule({
  declarations: [
    AppComponent,
    DialogContent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    MaterialRootModule,
    DatepickerModule
  ],
  providers: [],
  entryComponents: [DialogContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
