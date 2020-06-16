import { TestBed } from '@angular/core/testing';

import { FamiliaEmergencialCestasBasicasService } from './familia-emergencial-cestas-basicas.service';

describe('FamiliaEmergencialCestasBasicasService', () => {
  let service: FamiliaEmergencialCestasBasicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliaEmergencialCestasBasicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
