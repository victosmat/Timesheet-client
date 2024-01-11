import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentDto } from 'src/app/model/department-dto';
import { EmployeeDetailDto } from 'src/app/model/employee-detail-dto';
import { PmDto } from 'src/app/model/pm-dto';
import { RoleDto } from 'src/app/model/role-dto';
import { ProjectService } from 'src/app/service/project/project.service';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.scss']
})
export class SaveTaskComponent implements OnInit {

  taskForm!: FormGroup;
  employeeDetailDto!: EmployeeDetailDto;
  pmDto!: PmDto[];
  departments!: DepartmentDto[];
  roles!: RoleDto[];

  constructor(
    public dialogRef: MatDialogRef<SaveTaskComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    
    this.taskForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      taskType: new FormControl(null, Validators.required),
      taskStatus: new FormControl(null, Validators.required),
      priorityType: new FormControl(null, Validators.required),
    });

    this.taskForm.patchValue({
      name: this.data.task.name,
      description: this.data.task.description,
      taskType: this.data.task.taskType,
      taskStatus: this.data.task.taskStatus,
      priorityType: this.data.task.priorityType,
    });
  }


  submitFrom() {
    if (this.taskForm.invalid) {
      this.snackBar.open('Please fill out all the required fields !','OK', {
        duration: 2000,
        panelClass: ['matSnackBar-error'],
      });
      return;
    }

    const taskSaveSto = {
      id: this.data.task.id,
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      taskType: this.taskForm.value.taskType,
      taskStatus: this.taskForm.value.taskStatus,
      priorityType: this.taskForm.value.priorityType,
      projectId: this.data.projectId,
    };

    this.projectService
      .saveTask(taskSaveSto)
      .subscribe((response: any) => {
        console.log(response);
        this.dialogRef.close();
        this.snackBar.open('Save task successfull !','OK', {
          duration: 2000,
          panelClass: ['matSnackBar-success'],
        });
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
