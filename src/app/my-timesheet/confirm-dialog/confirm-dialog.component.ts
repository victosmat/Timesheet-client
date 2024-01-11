import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    console.log(this.data.noteId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.timesheetService.deleteTimesheet(this.data.noteId).subscribe({
      next : (response) => {
        console.log("OK");
      },
      error : (error) => {

      }
    });
  }

}
