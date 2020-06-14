import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFamiliasCestasComponent } from './listar-familias-cestas.component';

describe('ListarFamiliasCestasComponent', () => {
  let component: ListarFamiliasCestasComponent;
  let fixture: ComponentFixture<ListarFamiliasCestasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarFamiliasCestasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFamiliasCestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
