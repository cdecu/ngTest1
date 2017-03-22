import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerErrorComponent } from './answer-error.component';

describe('AnswerErrorComponent', () => {
  let component: AnswerErrorComponent;
  let fixture: ComponentFixture<AnswerErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
