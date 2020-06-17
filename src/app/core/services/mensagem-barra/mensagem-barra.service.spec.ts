import { TestBed } from '@angular/core/testing';

import { MensagemBarraService } from './mensagem-barra.service';

describe('MensagemBarraService', () => {
  let service: MensagemBarraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensagemBarraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
