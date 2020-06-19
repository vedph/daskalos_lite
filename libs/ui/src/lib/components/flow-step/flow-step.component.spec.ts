import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowStepComponent } from './flow-step.component';

describe('FlowStepComponent', () => {
  let component: FlowStepComponent;
  let fixture: ComponentFixture<FlowStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
