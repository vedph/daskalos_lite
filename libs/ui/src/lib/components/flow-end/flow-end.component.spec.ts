import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowEndComponent } from './flow-end.component';

describe('FlowEndComponent', () => {
  let component: FlowEndComponent;
  let fixture: ComponentFixture<FlowEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
