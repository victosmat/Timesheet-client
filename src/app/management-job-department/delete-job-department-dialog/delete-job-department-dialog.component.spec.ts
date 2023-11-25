import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteJobDepartmentDialogComponent } from './delete-job-department-dialog.component';

describe('DeleteJobDepartmentDialogComponent', () => {
  let component: DeleteJobDepartmentDialogComponent;
  let fixture: ComponentFixture<DeleteJobDepartmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteJobDepartmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteJobDepartmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
