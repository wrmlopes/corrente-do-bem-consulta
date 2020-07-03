import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CestabasicaComponent } from './cestabasica.component';

describe('CestabasicaComponent', () => {
  let component: CestabasicaComponent;
  let fixture: ComponentFixture<CestabasicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CestabasicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CestabasicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
