import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentDto } from 'src/app/model/department-dto';
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
  pmDto!: PmDto[];
  departments!: DepartmentDto[];
  roles!: RoleDto[];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
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
      buddyId: new FormControl(null, Validators.required),
      departmentId: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      jobDepartmentId: new FormControl(null, Validators.required),
      level: new FormControl(null, Validators.required),
    });

    this.getPms();
    this.getDepartments();
    this.getRoles();
  }

  getPms() {
    this.employeeService.getPms().subscribe({
      next: (response: any) => {
        this.pmDto = response;
        this.pmDto.push({
          id: 0,
          name: 'None',
        });
        console.log(this.pmDto);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  changUsername() {
    const usernameControl = this.profileFrom.value.username;
    if (usernameControl) {
      this.profileFrom.patchValue({ password: usernameControl.split('@')[0], });
    }
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

  isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submitFrom() {
    if (!this.profileFrom.valid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', {
        duration: 2000,
      });
      return;
    }

    const email = this.profileFrom.value.email;
    const username = this.profileFrom.value.username;
    if (!this.isValidEmail(email) || !this.isValidEmail(username)) {
      this.snackBar.open('Invalid email or username!', 'Close', {
        duration: 2000,
      });
      return;
    }

    if (username.split('@')[1] !== 'ncc.asia') {
      this.snackBar.open('The username must have the @ncc.asia extension!', 'Close', {
        duration: 2000,
      });
      return;
    }

    const employeeDto = {
      id: null,
      firstName: this.profileFrom.value.firstName,
      gender: this.profileFrom.value.gender,
      birthDate: this.profileFrom.value.birthday,
      email: this.profileFrom.value.email,
      lastName: this.profileFrom.value.lastName,
      bankName: this.profileFrom.value.bankName,
      bankNumber: this.profileFrom.value.bankNumber,
      hiringDate: this.profileFrom.value.hiringDate,
      buddyId: this.profileFrom.value.buddyId,
      departmentId: this.profileFrom.value.departmentId,
      username: this.profileFrom.value.username,
      password: this.profileFrom.value.password,
      jobDepartmentId: this.profileFrom.value.jobDepartmentId,
      level: this.profileFrom.value.level,
    }
    console.log(employeeDto);


    this.employeeService.addEmployee(employeeDto).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Add user successfully!', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Add user failed!', 'Close', {
          duration: 2000,
        });
      },
      complete: () => { },
    });
  }
  changePassword() {
    this.submitFrom();
  }
  changeInfo() { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
