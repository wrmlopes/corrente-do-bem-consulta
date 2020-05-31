import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaBeneficiarioComponent } from './consulta-beneficiario.component';

describe('ConsultaBeneficiarioComponent', () => {
  let component: ConsultaBeneficiarioComponent;
  let fixture: ComponentFixture<ConsultaBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
