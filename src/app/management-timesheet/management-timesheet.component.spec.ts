import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTimesheetComponent } from './management-timesheet.component';

describe('ManagementTimesheetComponent', () => {
  let component: ManagementTimesheetComponent;
  let fixture: ComponentFixture<ManagementTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
