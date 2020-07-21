import { TestBed } from '@angular/core/testing';

import { ValidatorCpfService } from './validator-cpf.service';

describe('ValidatorCpfService', () => {
  let service: ValidatorCpfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorCpfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
