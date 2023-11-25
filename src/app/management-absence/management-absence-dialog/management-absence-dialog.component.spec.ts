import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAbsenceDialogComponent } from './management-absence-dialog.component';

describe('ManagementAbsenceDialogComponent', () => {
  let component: ManagementAbsenceDialogComponent;
  let fixture: ComponentFixture<ManagementAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementAbsenceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
