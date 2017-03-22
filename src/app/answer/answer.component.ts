import { Component, OnInit, Input } from '@angular/core';
import {rmxMsg} from 'rmx.xmpp.utils/src/xmpp-rmx-message';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {

  @Input() answerMsg : rmxMsg.XmppRmxMessageIn;
  @Input() bgURL?: string;

  constructor() { }

  ngOnInit() {
  }

}
