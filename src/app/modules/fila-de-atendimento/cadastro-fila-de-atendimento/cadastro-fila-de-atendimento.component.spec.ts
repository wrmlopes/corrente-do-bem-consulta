import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroFilaDeAtendimentoComponent } from './cadastro-fila-de-atendimento.component';

describe('CadastroFilaDeAtendimentoComponent', () => {
  let component: CadastroFilaDeAtendimentoComponent;
  let fixture: ComponentFixture<CadastroFilaDeAtendimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroFilaDeAtendimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroFilaDeAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
