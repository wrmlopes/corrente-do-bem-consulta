import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CestasModalComponent } from './cestas-modal.component';

describe('CestasModalComponent', () => {
  let component: CestasModalComponent;
  let fixture: ComponentFixture<CestasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CestasModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CestasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
