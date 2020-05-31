import { TestBed } from '@angular/core/testing';

import { FamiliaEmergencialBeneficiosService } from './familia-emergencial-beneficios.service';

describe('FamiliaEmergencialBeneficiosService', () => {
  let service: FamiliaEmergencialBeneficiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliaEmergencialBeneficiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
