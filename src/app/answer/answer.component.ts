import { Component, OnInit } from '@angular/core';
import {rmxMsg} from 'rmx.xmpp.utils/src/xmpp-rmx-message';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {

  constructor(private parent: AppComponent) { }

  ngOnInit() {
  }

}
