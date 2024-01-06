import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDetailDto } from 'src/app/model/employee-detail-dto';
import { CheckinService } from 'src/app/service/checkin/checkin.service';
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

  probability: number = this.data.probability;
  isExactly: boolean = this.data.isSave;
  employeeDetailDto: EmployeeDetailDto = this.data.employee;

  checkProbability() {
    return this.probability > 70 ? true : false;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  checkin() {
    this.timesheetService
      .saveCheckpointTime(this.employeeDetailDto.id)
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.snackBar.open('Checkpoint successfully!', 'OK', {
              duration: 2000
            });
            const data = {
              employeeId: this.employeeDetailDto.id,
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
            this.snackBar.open('Checkpoint failed!', 'OK', {
              duration: 2000
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('Checkpoint failed!', 'OK', {
            duration: 2000
          });
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
      .saveCheckpointTime(this.employeeDetailDto.id)
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