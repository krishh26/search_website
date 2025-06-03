import { TestBed } from '@angular/core/testing';

import { ItSubcontractService } from './it-subcontract.service';

describe('ItSubcontractService', () => {
  let service: ItSubcontractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItSubcontractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
