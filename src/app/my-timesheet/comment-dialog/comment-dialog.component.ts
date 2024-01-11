import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteCommentViewDto } from 'src/app/model/note-comment-view-dto';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
})
export class CommentDialogComponent implements OnInit {
  noteCommentViewDto : NoteCommentViewDto = {};

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.timesheetService.getNoteCommentByNoteId(this.data.note.id).subscribe({
      next : (response) => {
        this.noteCommentViewDto = response;
        console.log(this.noteCommentViewDto);
      },
      error : (error) => {
        console.log(error);
        
      }
    });
  }

  confirm() {
    if (this.noteCommentViewDto.id){
      this.timesheetService.updateIsReaded(this.noteCommentViewDto.id).subscribe({
        next : (response) => {
          this.dialogRef.close();
          this.snackBar.open('Update isReaded successfully', 'Close', {
            duration: 2000,
          });
        },
        error : (error) => {
          console.log(error);
          this.snackBar.open('Update isReaded failed', 'Close', {
            duration: 2000,
          });
        }
      });
      this.dialogRef.close();
    }
  }
}
