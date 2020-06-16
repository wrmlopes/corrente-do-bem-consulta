import { TestBed } from '@angular/core/testing';

import { CestasBasicasService } from './cestas-basicas.service';

describe('CestasBasicasService', () => {
  let service: CestasBasicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CestasBasicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
