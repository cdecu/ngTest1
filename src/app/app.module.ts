import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent, DialogContent} from "./app.component";
import {RouterModule} from "@angular/router";
import {MaterialModule, MaterialRootModule} from "@angular/material";

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
    MaterialRootModule
  ],
  providers: [],
  entryComponents: [DialogContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
