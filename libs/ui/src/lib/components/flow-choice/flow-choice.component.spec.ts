import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChoiceComponent } from './flow-choice.component';

describe('FlowChoiceComponent', () => {
  let component: FlowChoiceComponent;
  let fixture: ComponentFixture<FlowChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
