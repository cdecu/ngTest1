import { Component, OnInit, Input } from '@angular/core';
import {rmxIntf} from 'rmx.xmpp.utils/src/xmpp-rmx-interfaces';

@Component({
  selector: 'app-answer-error',
  templateUrl: './answer-error.component.html',
  styleUrls: ['./answer-error.component.sass']
})
export class AnswerErrorComponent implements OnInit {

  @Input() answerError : string;

  constructor() { }

  ngOnInit() {
  }

}
