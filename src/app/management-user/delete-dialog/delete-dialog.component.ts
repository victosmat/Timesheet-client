import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/service/employee/employee.service';
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  delete() {
    this.employeeService.deleteUser(this.data.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Delete user successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete user failed', 'Close', {
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
