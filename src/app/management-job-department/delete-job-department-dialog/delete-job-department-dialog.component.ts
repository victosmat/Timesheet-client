import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-delete-job-department-dialog',
  templateUrl: './delete-job-department-dialog.component.html',
  styleUrls: ['./delete-job-department-dialog.component.scss']
})
export class DeleteJobDepartmentDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteJobDepartmentDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.employeeService.deleteJobDepartment(this.data.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Delete successfully', 'Close', {
          duration: 3000,
          panelClass: ['blue-snackbar']
        });
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete failed', 'Close', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
      }
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
