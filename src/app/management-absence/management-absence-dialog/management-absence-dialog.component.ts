import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { AbsenceManageViewDto } from 'src/app/model/absence-manage-view-dto';
import { AbsenceService } from 'src/app/service/absence/absence.service';
import { UpdateStatusPunismentComponent } from '../update-status-punisment/update-status-punisment.component';

@Component({
  selector: 'app-management-absence-dialog',
  templateUrl: './management-absence-dialog.component.html',
  styleUrls: ['./management-absence-dialog.component.scss']
})
export class ManagementAbsenceDialogComponent implements OnInit {

  orderForm!: FormGroup;
  absenceViewDto!: AbsenceManageViewDto[];

  constructor(
    private dialogRef: MatDialogRef<ManagementAbsenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,
    private absenceService: AbsenceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const date = this.data.date as Date;
    const email = this.data.email as string;
    const status = this.data.status as string;
    const type = this.data.type as string;
    this.listAllAbsenceRequestInThisDate(
      date,
      (email === 'ALL' ? '' : email),
      (status === 'ALL' ? '' : status),
      (type === 'ALL' ? '' : type));
  }

  listAllAbsenceRequestInThisDate(date: Date, email: string, status: string, type: string) {
    this.absenceService
      .listAllAbsenceRequestInThisDate(date, email, status, type)
      .subscribe({
        next: (response) => {
          this.absenceViewDto = response;
          console.log(this.absenceViewDto);
        },
      });
  }

  updateStatusPunishment(id: number | null, punishmentStatus: Boolean | null) {
    this.dialog.open(UpdateStatusPunismentComponent, {
      data: {
        absenceId: id,
        punishmentStatus: punishmentStatus,
      },
    }).afterClosed().subscribe({
      next: (response: any) => {
        console.log(response);
        this.ngOnInit();
      },
      error: (error: any) => {
        console.log(error);
      },
    });

  }
  approvedAbsenceRequest(id: number | null, status: string | null) {
    if (status) {
      if (id)
        this.absenceService.approvedAbsenceRequest(id).subscribe({
          next: (response: any) => {
            console.log(response);
            this.ngOnInit();
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  RejectAbsenceRequest(id: number | null, status: string | null) {
    if (status) {
      if (id)
        this.absenceService.RejectAbsenceRequest(id).subscribe({
          next: (response: any) => {
            console.log(response);
            this.ngOnInit();
            this.snackBar.open('Rejected successfully!', 'Close', {
              duration: 2000,
              panelClass: ['green-snackbar'],
            });
          },
          error: (error: any) => {
            console.log(error);
            this.snackBar.open('Rejected failed!', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    }
  }
}
