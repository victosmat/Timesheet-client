import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { AbsenceService } from 'src/app/service/absence/absence.service';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';
@Component({
  selector: 'app-update-status-punisment',
  templateUrl: './update-status-punisment.component.html',
  styleUrls: ['./update-status-punisment.component.scss']
})
export class UpdateStatusPunismentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateStatusPunismentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private absenceService: AbsenceService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    console.log(this.data);
  }

  updateIsDeleted() {
    const id = this.data.absenceId;
    const punishmentStatus = this.data.punishmentStatus;
    console.log(punishmentStatus);
    if (id && punishmentStatus !== null)
      this.absenceService.updateStatusPunishment(id, !punishmentStatus).subscribe({
        next: (response: any) => {
          console.log(response);
          this.snackBar.open('Approved successfully!', 'Close', {
            duration: 2000,
            panelClass: ['green-snackbar'],
          });
        },
        error: (error: any) => {
          console.log(error);
          this.snackBar.open('Approved failed!', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
