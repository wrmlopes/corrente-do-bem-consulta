import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilaDeAtendimentoComponent } from './fila-de-atendimento.component';

describe('FilaDeAtendimentoComponent', () => {
  let component: FilaDeAtendimentoComponent;
  let fixture: ComponentFixture<FilaDeAtendimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilaDeAtendimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilaDeAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
