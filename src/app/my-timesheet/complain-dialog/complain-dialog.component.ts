import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { da } from 'date-fns/locale';
import { CookieService } from 'ngx-cookie-service';
import { CheckinPunishmentDto } from 'src/app/model/checkin-punishment-dto';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

@Component({
  selector: 'app-complain-dialog',
  templateUrl: './complain-dialog.component.html',
  styleUrls: ['./complain-dialog.component.scss'],
})
export class ComplainDialogComponent implements OnInit {

  complainFrom!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ComplainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private timesheetService: TimesheetService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log(this.data.note.complain);
    this.complainFrom = this.formBuilder.group({
      complain: new FormControl(null, Validators.required),
    });
    if (this.data.note.complain != null) {
      console.log('not null');
      this.complainFrom.patchValue({complain: this.data.note.complain});
    } else {
      this.complainFrom.patchValue({complain: ''});
    }
  }

  submitForm(){
    const complain = this.complainFrom.value.complain;
    const checkinId = this.data.note.id;
    this.timesheetService.saveComplain(checkinId, complain).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.snackBar.open('Complain successfully', 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        this.dialogRef.close();
        this.snackBar.open('Complain failed', 'OK', {
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
