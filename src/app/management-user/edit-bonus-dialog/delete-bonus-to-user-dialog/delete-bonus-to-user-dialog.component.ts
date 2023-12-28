import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-delete-bonus-to-user-dialog',
  templateUrl: './delete-bonus-to-user-dialog.component.html',
  styleUrls: ['./delete-bonus-to-user-dialog.component.scss']
})
export class DeleteBonusToUserDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteBonusToUserDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  delete() {
    this.employeeService.deleteBonusForUser(this.data.bonus.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Delete bonus for user successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete bonus for user failed', 'Close', {
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
