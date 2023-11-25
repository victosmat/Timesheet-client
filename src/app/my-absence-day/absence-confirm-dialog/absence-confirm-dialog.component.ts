import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbsenceService } from 'src/app/service/absence/absence.service';

@Component({
  selector: 'app-absence-confirm-dialog',
  templateUrl: './absence-confirm-dialog.component.html',
  styleUrls: ['./absence-confirm-dialog.component.scss']
})
export class AbsenceConfirmDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AbsenceConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {    
  }

  deleteItem() {
    return this.absenceService.deleteAbsenceRequestById(Number(this.data.absenceId)).subscribe({
      next: (response) => {
        if(response === true) {
          this.snackBar.open("Delete request successfully!", "OK");
        } else {
          this.snackBar.open("Delete request failed!", "OK");
        }
      },
      error: (error) => {
        this.snackBar.open("Error occurred!", "OK");
      }
    });
  }

}
