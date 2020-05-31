import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroFamiliaEmergencialComponent } from './cadastro-familia-emergencial.component';

describe('CadastroFamiliaEmergencialComponent', () => {
  let component: CadastroFamiliaEmergencialComponent;
  let fixture: ComponentFixture<CadastroFamiliaEmergencialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroFamiliaEmergencialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroFamiliaEmergencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
