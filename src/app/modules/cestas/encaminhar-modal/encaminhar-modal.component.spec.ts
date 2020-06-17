import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncaminharModalComponent } from './encaminhar-modal.component';

describe('EncaminharModalComponent', () => {
  let component: EncaminharModalComponent;
  let fixture: ComponentFixture<EncaminharModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncaminharModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncaminharModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
