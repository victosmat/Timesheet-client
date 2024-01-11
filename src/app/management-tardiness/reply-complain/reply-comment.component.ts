import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';
@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent implements OnInit {

  complainFrom!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReplyCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private timesheetService: TimesheetService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.complainFrom = this.formBuilder.group({
      complain: new FormControl(null, Validators.required),
    });
    if (this.data.complain != null) {
      console.log('not null');
      this.complainFrom.patchValue({complain: this.data.complainReply});
    } else {
      this.complainFrom.patchValue({complain: ''});
    }
  }

  submitForm(){
    const complain = this.complainFrom.value.complain;
    const checkinId = this.data.id;
    this.timesheetService.saveReplyComplain(checkinId, complain).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.snackBar.open('Complain successfully', 'OK', {
          duration: 2000,
        });
      },
      error: () => {
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
