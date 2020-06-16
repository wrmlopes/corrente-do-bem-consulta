import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliaModalComponent } from './familia-modal.component';

describe('FamiliaModalComponent', () => {
  let component: FamiliaModalComponent;
  let fixture: ComponentFixture<FamiliaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamiliaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
