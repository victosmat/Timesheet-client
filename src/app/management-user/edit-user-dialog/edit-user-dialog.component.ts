import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import { PmDto } from 'src/app/model/pm-dto';
import { DepartmentDto } from 'src/app/model/department-dto';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  profileFrom!: FormGroup;
  pmDto!: PmDto[];
  departments!: DepartmentDto[];

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeService.getPms().subscribe({
      next: (response: any) => {
        this.pmDto = response;
        console.log(this.pmDto);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => {},
    });

    this.employeeService.getDepartments("").subscribe({
      next: (response: any) => {
        this.departments = response;
        console.log(this.departments);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => {},
    });

    this.profileFrom = new FormGroup({
      hiringDate: new FormControl(null),
      buddyName: new FormControl(null),
      departmentName: new FormControl(null),
      level: new FormControl(null),
    });

    console.log(this.data);

    this.profileFrom.patchValue({hiringDate: this.data.hiringDate});
    this.profileFrom.patchValue({buddyName: this.data.buddyName});
    this.profileFrom.patchValue({departmentName: this.data.departmentName});
    this.profileFrom.patchValue({level: this.data.roles});
    this.profileFrom.patchValue({isEnabled: this.data.isEnabled});
  }

  submitForm(){
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
