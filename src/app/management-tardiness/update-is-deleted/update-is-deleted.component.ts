import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';
@Component({
  selector: 'app-update-is-deleted',
  templateUrl: './update-is-deleted.component.html',
  styleUrls: ['./update-is-deleted.component.scss']
})
export class UpdateIsDeletedComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<UpdateIsDeletedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  updateIsDeleted(){
    const punishmentId = this.data.item.id;
    const isDeleted = this.data.checkIsDeleted;
    const isDeletedBool = isDeleted === 1 ? true : false;
    this.timesheetService.updateIsDeleted(punishmentId, isDeletedBool).subscribe({
      next: (response: any) => {
        this.snackBar.open('Update is deleted successfully', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Update is deleted failed', 'Close', {
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
