import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckinService } from 'src/app/service/checkin.service';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

@Component({
  selector: 'app-confirm-checkin-dialog',
  templateUrl: './confirm-checkin-dialog.component.html',
  styleUrls: ['./confirm-checkin-dialog.component.scss']
})
export class ConfirmCheckinDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmCheckinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private checkinService: CheckinService,
    private snackBar: MatSnackBar
  ) { }

  employeeId: number = this.data.employeeId;
  probability: number = this.data.probability;
  isExactly: boolean = this.data.isSave;

  checkProbability() {
    return this.probability > 70 ? true : false;
  }

  ngOnInit(): void {
    console.log(this.data);
  }
  checkin() {
    this.timesheetService
      .saveCheckpointTime(this.employeeId)
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.snackBar.open('Checkpoint sucessfully!', 'OK');
            const data = {
              employeeId: this.employeeId
            };
            this.checkinService.saveImage(data).subscribe({
              next: (response: any) => {
                console.log(response);
              },
              error: (error: any) => {
                console.log(error);
              },
            });
          } else {
            this.snackBar.open('Checkpoint failed!', 'OK');
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('Checkpoint failed!', 'OK');
        },
      });
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onNoClickSucces(): void {
    this.dialogRef.close();
    this.timesheetService
      .saveCheckpointTime(this.employeeId)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.dialogRef.close();
  }
}