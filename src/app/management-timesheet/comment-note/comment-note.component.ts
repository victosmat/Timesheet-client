import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { NoteDetailViewDto } from 'src/app/model/NoteDetailViewDto';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

@Component({
  selector: 'app-comment-note',
  templateUrl: './comment-note.component.html',
  styleUrls: ['./comment-note.component.scss']
})
export class CommentNoteComponent implements OnInit {

  noteDetailViewDto : NoteDetailViewDto = {
    completed: false
  };

  commentFrom!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CommentNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDetailViewDto,
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.commentFrom = new FormGroup({
      comment: new FormControl(this.data.comment, Validators.required),
    });
  }

  submitForm() {
    const noteCommentId = this.data.noteCommentId as number;
    const comment = this.commentFrom.value.comment;
    const noteId = this.data.noteId as number;
    
    this.timesheetService.updateComment(noteCommentId, comment, noteId, Number(this.cookieService.get('TimesheetAppEmployeeId')))
      .subscribe(
        (response: any) => {
          console.log(response);
          this.dialogRef.close();
          this.snackBar.open('Update comment successfully', 'Close', {
            duration: 2000,
          });
        },
        (error: any) => {
          console.log(error);
          this.snackBar.open('Update comment failed', 'Close', {
            duration: 2000,
          });
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
