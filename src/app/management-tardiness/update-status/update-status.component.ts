import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';
@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar
  ) { }

  statusResult = (this.data.status === 'CHECK_POINT') ? 'REJECTED' : 'CHECK_POINT';

  ngOnInit(): void {
    console.log(this.data);
  }

  updateStatus() {
    console.log(this.data);
    this.timesheetService.updateStatusCheckin(this.data.id, this.statusResult).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Update status successfully', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Update status failed', 'Close', {
          duration: 2000,
        });
      },
      complete: () => {},
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
