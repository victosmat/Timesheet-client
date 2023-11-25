import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveJobDepartmentDialogComponent } from './save-job-department-dialog.component';

describe('SaveJobDepartmentDialogComponent', () => {
  let component: SaveJobDepartmentDialogComponent;
  let fixture: ComponentFixture<SaveJobDepartmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveJobDepartmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveJobDepartmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
