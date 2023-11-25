import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private timesheetService: TimesheetService
  ) {}

  ngOnInit(): void {
    this.timesheetService.getNoteCommentByNoteId(this.data.note.id).subscribe({
      next : (response) => {
        this.noteCommentViewDto = response;
        console.log(this.noteCommentViewDto);
      },
      error : (error) => {

      }
    });
  }

  confirm() {
    if (this.noteCommentViewDto.id){
      this.timesheetService.updateIsReaded(this.noteCommentViewDto.id).subscribe({
        next : (response) => {
          this.dialogRef.close();
        },
        error : (error) => {
  
        }
      });
      this.dialogRef.close();
    }
  }
}
