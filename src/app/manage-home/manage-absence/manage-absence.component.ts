import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageTimesheetComponent } from '../manage-timesheet/manage-timesheet.component';
import { AbsenceService } from 'src/app/service/absence/absence.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetStatus } from 'src/app/my-timesheet/my-timesheet.component';
import { AbsenceStatus } from 'src/app/model/absence-dto';

@Component({
  selector: 'app-manage-absence',
  templateUrl: './manage-absence.component.html',
  styleUrls: ['./manage-absence.component.scss']
})
export class ManageAbsenceComponent implements OnInit {

  currentDate = new Date();
  dataSource : Map<string, any> = new Map<string, any>();
  displayedColumns: string[] = ['no', 'absenceType', 'absenceTypeOff', 'reason', 'dateRequest', 'timeOff', 'typeTimeOff', 'actions'];
  absenceStatus = AbsenceStatus;

  constructor(
    public dialogRef: MatDialogRef<ManageTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private absenceService : AbsenceService,
    private snackBar : MatSnackBar
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    this.getDataList();
  }

  getDataList() {
    this.absenceService.getStaffAbsenceByTime(this.data.id, this.currentDate.getMonth(), this.currentDate.getFullYear()).subscribe({
      next: (response) => {
        console.log(response);
        this.dataSource = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getDateRequest(item : number[]) {
    return new Date(item[0], item[1] - 1, item[2]);
  }

  updateAbsenceStatus(absenceId : number, status : AbsenceStatus) {
    this.absenceService.updateStaffAbsenceStatus(absenceId, status).subscribe({
      next : (response) => {
        if(response === true) {
          this.snackBar.open("Successfully!", "OK");
          this.getDataList();
        } else {
          this.snackBar.open("Error when update absence status!", "OK");
        }
      },
      error : (error) => {
        console.log(error);
        this.snackBar.open("Error when update absence status!", "OK");
      },
    });
  }

}
