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
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {
  profileFrom!: FormGroup;
  employeeDetailDto!: EmployeeDetailDto;
  pmDto!: PmDto[];
  departments!: DepartmentDto[];
  roles!: RoleDto[];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.profileFrom = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      bankName: new FormControl(null),
      bankNumber: new FormControl(null),
      hiringDate: new FormControl(null, Validators.required),
      buddyName: new FormControl(null, Validators.required),
      departmentName: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      jobDepartment: new FormControl(null, Validators.required),
      level: new FormControl(null, Validators.required),
    });

    const usernameControl = this.profileFrom.value.username;
    const passwordControl = this.profileFrom.value.password;

    if (usernameControl && passwordControl) {
      usernameControl.valueChanges.subscribe((value: string) => {
        if (value.includes('@')) {
          passwordControl.disable();
        } else {
          passwordControl.enable();
        }
      });
    }

    this.getPms();
    this.getDepartments();
    this.getRoles();
  }

  getPms() {
    this.employeeService.getPms().subscribe({
      next: (response: any) => {
        this.pmDto = response;
        console.log(this.pmDto);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  getDepartments() {
    this.employeeService.getDepartments("").subscribe({
      next: (response: any) => {
        this.departments = response;
        console.log(this.departments);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  getRoles() {
    this.employeeService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response;
        console.log(this.roles);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  submitFrom() { 
    this.employeeDetailDto = this.profileFrom.value;
    console.log(this.employeeDetailDto);
    if(this.profileFrom.valid) {
      this.employeeService.addEmployee(this.employeeDetailDto).subscribe({
        next: (response: any) => {
          this.snackBar.open('Add user successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.dialogRef.close();
        },
        error: (error: any) => {
          console.log(error.status);
        },
        complete: () => { },
      });
    }else{
      this.snackBar.open('Please fill in all required fields!', 'Close', {
        duration: 3000,
      });
    }
  }
  changePassword() {
    this.submitFrom();
  }
  changeInfo() { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
