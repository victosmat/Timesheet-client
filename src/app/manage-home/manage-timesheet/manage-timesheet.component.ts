import { Component, Inject, OnInit } from '@angular/core';
import { TimesheetService } from '../../service/timesheet/timesheet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetStatus } from 'src/app/my-timesheet/my-timesheet.component';

@Component({
  selector: 'app-manage-timesheet',
  templateUrl: './manage-timesheet.component.html',
  styleUrls: ['./manage-timesheet.component.scss']
})
export class ManageTimesheetComponent implements OnInit {

  currentDate = new Date();
  dataSource : Map<string, any> = new Map<string, any>();
  displayedColumns: string[] = ['no', 'projectName', 'taskName', 'noteDescription', 'dateSubmit', 'workingTime', 'actions'];
  timesheetStatus = TimeSheetStatus;

  constructor(
    private dialogRef: MatDialogRef<ManageTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService : TimesheetService,
    private snackBar : MatSnackBar
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    this.getDataList();
  }

  getDataList() {
    this.timesheetService.getStaffTimesheetByTime(this.data.id, this.currentDate.getMonth(), this.currentDate.getFullYear()).subscribe({
      next: (response) => {
        this.dataSource = response;
        console.log(this.dataSource);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getDateSubmit(item : number[]) {
    return new Date(item[0], item[1] - 1, item[2]);
  }

  updateTimesheetStatus(id : number, status : TimeSheetStatus) {
    this.timesheetService.updateStaffTimesheetStatus(id, status).subscribe({
      next : (response) => {
        if(response === true) {
          this.snackBar.open("Successfully!", "OK");
          this.getDataList();
        } else {
          this.snackBar.open("Error when update timesheet!", "OK");
        }
      },
      error : (error) => {
        console.log(error);
        this.snackBar.open("Error when update timesheet!", "OK");
      },
    });
  }

}
