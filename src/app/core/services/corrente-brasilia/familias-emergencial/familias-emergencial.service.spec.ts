import { TestBed } from '@angular/core/testing';

import { FamiliasEmergencialService } from './familias-emergencial.service';

describe('FamiliasEmergencialService', () => {
  let service: FamiliasEmergencialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliasEmergencialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
