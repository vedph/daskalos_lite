import { TestBed } from '@angular/core/testing';

import { LocalFlowsService } from './local-flows.service';

describe('LocalFlowsService', () => {
  let service: LocalFlowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalFlowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
