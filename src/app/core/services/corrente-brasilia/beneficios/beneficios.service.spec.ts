import { TestBed } from '@angular/core/testing';

import { BeneficiosService } from './beneficios.service';

describe('BeneficiosService', () => {
  let service: BeneficiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
