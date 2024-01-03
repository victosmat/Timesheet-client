import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeDetailDto } from '../model/employee-detail-dto';
import { UpdatePasswordDialogComponent } from './update-password-dialog/update-password-dialog.component';
import { ViewBonusDialogComponent } from './view-bonus-dialog/view-bonus-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileFrom!: FormGroup;
  employeeDetailDto!: EmployeeDetailDto;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) { }

  getProfile() {
    const employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
    this.employeeService.getProfile(employeeId).subscribe({
      next: (response: any) => {
        this.employeeDetailDto = response;
        if (response.length === 0) {
          this.snackBar.open('No data', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          return;
        }
        console.log(this.employeeDetailDto);
        this.profileFrom.patchValue({
          firstName: this.employeeDetailDto.firstName,
        });
        this.profileFrom.patchValue({
          lastName: this.employeeDetailDto.lastName,
        });
        this.profileFrom.patchValue({ gender: this.employeeDetailDto.gender });
        this.profileFrom.patchValue({
          birthday: this.employeeDetailDto.birthDate,
        });
        this.profileFrom.patchValue({ email: this.employeeDetailDto.email });
        this.profileFrom.patchValue({
          bankName: this.employeeDetailDto.bankName,
        });
        this.profileFrom.patchValue({
          bankNumber: this.employeeDetailDto.bankNumber,
        });
        this.profileFrom.patchValue({
          hiringDate: this.employeeDetailDto.hiringDate,
        });
        this.profileFrom.patchValue({
          buddyName: this.employeeDetailDto.buddyName,
        });
        this.profileFrom.patchValue({
          departmentName: this.employeeDetailDto.departmentName,
        });
        this.profileFrom.patchValue({
          salary: this.employeeDetailDto.jobDepartmentSalaryRange,
        });
        this.profileFrom.patchValue({
          level: this.employeeDetailDto.employeeLevelStatus,
        });
        this.profileFrom.patchValue({
          jobDepartment: this.employeeDetailDto.jobDepartment,
        });
        this.profileFrom.patchValue({
          username: this.employeeDetailDto.username,
        });
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
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
      hiringDate: new FormControl(null),
      buddyName: new FormControl(null),
      departmentName: new FormControl(null),
      username: new FormControl(null),
      jobDepartment: new FormControl(null),
      salary: new FormControl(null),
      level: new FormControl(null),
    });
    this.getProfile();

    console.log(this.employeeDetailDto);
  }
  submitFrom() { }
  changePassword() {
    this.dialog
      .open(UpdatePasswordDialogComponent, {
        width: '500px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.getProfile();
        },
      });
  }
  changeInfo() {
    if (this.profileFrom.valid) {
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  notify() {
    this.snackBar.open('This field is readonly and cannot be changed.', 'OK');
  }

  viewBonus() {
    this.dialog.open(ViewBonusDialogComponent, {
      width: '1000px',
      data: this.employeeDetailDto,
    });
  }
}
