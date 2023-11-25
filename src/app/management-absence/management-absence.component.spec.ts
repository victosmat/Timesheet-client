import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAbsenceComponent } from './management-absence.component';

describe('ManagementAbsenceComponent', () => {
  let component: ManagementAbsenceComponent;
  let fixture: ComponentFixture<ManagementAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementAbsenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
