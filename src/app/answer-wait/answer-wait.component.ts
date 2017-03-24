import {Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-answer-wait',
  templateUrl: './answer-wait.component.html',
  styleUrls: ['./answer-wait.component.sass']
})
export class AnswerWaitComponent implements OnInit {

  constructor(private parent: AppComponent) { }

  ngOnInit() {
  }

}
