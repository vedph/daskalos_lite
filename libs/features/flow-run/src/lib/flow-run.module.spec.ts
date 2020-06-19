import { async, TestBed } from '@angular/core/testing';
import { FlowRunModule } from './flow-run.module';

describe('FlowRunModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FlowRunModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FlowRunModule).toBeDefined();
  });
});
