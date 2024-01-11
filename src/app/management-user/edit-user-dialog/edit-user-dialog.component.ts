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
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    console.log(this.data);

    let buddyId: number = 0;
    let departmentId: number = 0;

    this.profileFrom = new FormGroup({
      hiringDate: new FormControl(null, Validators.required),
      buddyId: new FormControl(null),
      departmentId: new FormControl(null, Validators.required),
      level: new FormControl(null, Validators.required),
    });

    this.employeeService.getPms().subscribe({
      next: (response: any) => {
        this.pmDto = response;
        console.log(this.pmDto);
        this.pmDto.forEach(pm => {
          if (pm.name === this.data.buddyName) {
            buddyId = pm.id;
            return;
          }
        });
        this.employeeService.getDepartments("").subscribe({
          next: (response: any) => {
            this.departments = response;
            console.log(this.departments);
            this.departments.forEach(department => {
              if (department.name === this.data.departmentName) {
                departmentId = department.id as number;
                return;
              }
            });

            console.log(this.data);
            console.log(buddyId);
            console.log(departmentId);

            this.profileFrom.patchValue({ hiringDate: this.data.hiringDate });
            this.profileFrom.patchValue({ buddyId: buddyId });
            this.profileFrom.patchValue({ departmentId: departmentId });
            this.profileFrom.patchValue({ level: this.data.levelStatus });
          },
          error: (error: any) => {
            console.log(error.status);
          },
        });
      },
      error: (error: any) => {
        console.log(error.status);
      },
    });
  }

  submitForm() {
    const employeeSaveDto = {
      id: this.data.id,
      hiringDate: this.profileFrom.value.hiringDate,
      buddyId: this.profileFrom.value.buddyId,
      departmentId: this.profileFrom.value.departmentId,
      level: this.profileFrom.value.level,
    };

    this.employeeService.addEmployee(employeeSaveDto).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === true) {
          this.snackBar.open("Edit user successfully!", "Close", {
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        }
        else {
          this.snackBar.open("Edit user failed!", "Close", {
            duration: 2000,
            panelClass: ['red-snackbar']
          });
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open("Edit user failed!", "Close", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
