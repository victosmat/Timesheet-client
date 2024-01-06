import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckinService } from 'src/app/service/checkin/checkin.service';
@Component({
  selector: 'app-delete-image-checkin-dialog',
  templateUrl: './delete-image-checkin-dialog.component.html',
  styleUrls: ['./delete-image-checkin-dialog.component.scss']
})
export class DeleteImageCheckinDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteImageCheckinDialogComponent>,
    private checkinService: CheckinService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  delete() {
    this.checkinService.deleteImage(this.data.image.nameFile, this.data.employee.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Delete image checkin successfully', 'Close', {
          duration: 2000,
        });
        this.dialogRef.close();
      },
      error: (error: any) => {
        console.log(error);
        this.snackBar.open('Delete image checkin failed', 'Close', {
          duration: 2000,
        });
      },
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
