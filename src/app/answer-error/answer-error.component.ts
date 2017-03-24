import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-answer-error',
  templateUrl: './answer-error.component.html',
  styleUrls: ['./answer-error.component.sass']
})
export class AnswerErrorComponent implements OnInit {

  constructor(private parent: AppComponent) { }

  ngOnInit() {
  }

}
