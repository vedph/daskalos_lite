import { TestBed } from '@angular/core/testing';

import { FlowSupplierService } from './flow-supplier.service';

describe('FlowSupplierService', () => {
  let service: FlowSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
