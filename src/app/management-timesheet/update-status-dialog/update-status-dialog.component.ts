import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteDetailViewDto } from 'src/app/model/NoteDetailViewDto';
import { DepartmentDto } from 'src/app/model/department-dto';
import { EmployeeDetailDto } from 'src/app/model/employee-detail-dto';
import { PmDto } from 'src/app/model/pm-dto';
import { RoleDto } from 'src/app/model/role-dto';
import { ProjectService } from 'src/app/service/project/project.service'; @Component({
  selector: 'app-update-status-dialog',
  templateUrl: './update-status-dialog.component.html',
  styleUrls: ['./update-status-dialog.component.scss']
})
export class UpdateStatusDialogComponent implements OnInit {

  taskForm!: FormGroup;
  employeeDetailDto!: EmployeeDetailDto;
  pmDto!: PmDto[];
  departments!: DepartmentDto[];
  roles!: RoleDto[];

  constructor(
    public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: NoteDetailViewDto,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.taskForm = new FormGroup({
      description: new FormControl({ value: null, readonly: true }),
      taskStatus: new FormControl(null, Validators.required),
    });


    this.taskForm.patchValue({
      description: this.data.taskCode,
      taskStatus: this.data.taskStatus,
    });
  }


  submitFrom() {
    if (this.taskForm.invalid) {
      this.snackBar.open('Please fill out all the required fields !', 'OK', {
        duration: 2000,
        panelClass: ['matSnackBar-error'],
      });
      return;
    }

    const taskId = this.data.taskId as number;

    this.projectService.updateTaskStatus(taskId, this.taskForm.value.taskStatus).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === true) {
          this.snackBar.open('Update task status successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close();
        }
        else {
          this.snackBar.open('Update task status failed', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Update task status failed', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
