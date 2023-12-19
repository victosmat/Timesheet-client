import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-update-password-dialog',
  templateUrl: './update-password-dialog.component.html',
  styleUrls: ['./update-password-dialog.component.scss'],
})
export class UpdatePasswordDialogComponent implements OnInit {
  passwordFrom!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.passwordFrom = this.formBuilder.group({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      repeatPassword: new FormControl(null, Validators.required)
    });
  }
  submitForm() {
    const employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
    const oldPassword = this.passwordFrom.value.oldPassword;
    const newPassword = this.passwordFrom.value.newPassword;
    const repeatPassword = this.passwordFrom.value.repeatPassword;
    if (this.passwordFrom.valid) {
      if (newPassword !== repeatPassword) {
        this.snackBar.open('New password and repeat password are not the same', 'Close', {
          duration: 2000,
        });
        return;
      }
      else{
        this.employeeService.updatePassword(employeeId, oldPassword, newPassword).subscribe({
          next: (response: any) => {
            console.log(response);
            this.snackBar.open('Update password successfully', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close();
          },
          error: (error: any) => {
            console.log(error);
            this.snackBar.open('Update password failed', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    }else{
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 2000,
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
