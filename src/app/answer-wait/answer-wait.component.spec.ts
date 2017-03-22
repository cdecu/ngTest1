import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerWaitComponent } from './answer-wait.component';

describe('AnswerWaitComponent', () => {
  let component: AnswerWaitComponent;
  let fixture: ComponentFixture<AnswerWaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerWaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
