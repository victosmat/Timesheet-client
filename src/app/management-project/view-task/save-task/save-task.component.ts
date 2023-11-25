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
import { TaskDetailDto } from 'src/app/model/task-detail-dto';
import { EmployeeService } from 'src/app/service/employee/employee.service';
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
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailDto,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {}

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
      name: this.data.name,
      description: this.data.description,
      taskType: this.data.taskType,
      taskStatus: this.data.taskStatus,
      priorityType: this.data.priorityType,
    });
  }


  submitFrom() {}
  changePassword() {
    this.submitFrom();
  }
  changeInfo() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
