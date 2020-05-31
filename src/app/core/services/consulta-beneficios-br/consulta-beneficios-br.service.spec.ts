import { TestBed } from '@angular/core/testing';

import { ConsultaBeneficiosBrService } from './consulta-beneficios-br.service';

describe('ConsultaBeneficiosBrService', () => {
  let service: ConsultaBeneficiosBrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaBeneficiosBrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
