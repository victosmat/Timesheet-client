import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAbsenceComponent } from './manage-absence.component';

describe('ManageAbsenceComponent', () => {
  let component: ManageAbsenceComponent;
  let fixture: ComponentFixture<ManageAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAbsenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
