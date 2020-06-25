import { TestBed } from '@angular/core/testing';

import { FamiliasExcluidasService } from './familias-excluidas.service';

describe('FamiliasExcluidasService', () => {
  let service: FamiliasExcluidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliasExcluidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
