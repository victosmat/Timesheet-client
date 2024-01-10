import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/service/employee/employee.service';
@Component({
  selector: 'app-change-info-dialog',
  templateUrl: './change-info-dialog.component.html',
  styleUrls: ['./change-info-dialog.component.scss']
})
export class ChangeInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChangeInfoDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  changeInfo() {
    this.employeeService.addEmployee(this.data).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response === true) {
          this.snackBar.open('Change info successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
        } else {
          this.snackBar.open('Change info failed', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Change info failed', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
