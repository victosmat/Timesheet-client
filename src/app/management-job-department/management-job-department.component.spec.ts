import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementJobDepartmentComponent } from './management-job-department.component';

describe('ManagementJobDepartmentComponent', () => {
  let component: ManagementJobDepartmentComponent;
  let fixture: ComponentFixture<ManagementJobDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementJobDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementJobDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
