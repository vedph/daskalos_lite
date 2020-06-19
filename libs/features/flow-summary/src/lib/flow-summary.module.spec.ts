import { async, TestBed } from '@angular/core/testing';
import { FlowSummaryModule } from './flow-summary.module';

describe('FlowSummaryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FlowSummaryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FlowSummaryModule).toBeDefined();
  });
});
