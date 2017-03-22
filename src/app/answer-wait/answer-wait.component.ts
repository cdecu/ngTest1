import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-answer-wait',
  templateUrl: './answer-wait.component.html',
  styleUrls: ['./answer-wait.component.sass']
})
export class AnswerWaitComponent implements OnInit {

  @Input() statusMsg : string;

  constructor() { }

  ngOnInit() {
  }

}
