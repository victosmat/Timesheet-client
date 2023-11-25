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
import { CookieService } from 'ngx-cookie-service';
import { AbsenceManageViewDto } from 'src/app/model/absence-manage-view-dto';
import { AbsenceService } from 'src/app/service/absence/absence.service';

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
    private dialog: MatDialog
  ) {}

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

  updateStatusPunishment(id: number | null, type: string | null) {
    // console.log(type);
    // const dialogRef = this.dialog.open(AbsenceFormDialogComponent, {
    //   data: {
    //     employeeId: this.cookieService.get('TimesheetAppEmployeeId'),
    //     absenceId: id,
    //     type: type,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((response) => {
    //   const date = this.data.date as Date;
    //   this.listAllAbsenceRequestInThisDateOfEmployee(
    //     date,
    //     Number(this.cookieService.get('TimesheetAppEmployeeId'))
    //   );
    // });
  }
  approvedAbsenceRequest(id: number | null, status: string | null) {
    // if (status) {
    //   if (status === 'PENDING') {
    //     const dialogRef = this.dialog.open(AbsenceConfirmDialogComponent, {
    //       data: { absenceId: id },
    //     });
    //     dialogRef.afterClosed().subscribe((response) => {
    //       const date = this.data.date as Date;
    //       this.listAllAbsenceRequestInThisDateOfEmployee(
    //         date,
    //         Number(this.cookieService.get('TimesheetAppEmployeeId'))
    //       );
    //     });
    //   }
    // }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  RejectAbsenceRequest(id: number | null, status: string | null) {
    // if (status) {
    //   if (status === 'PENDING') {
    //     const dialogRef = this.dialog.open(AbsenceConfirmDialogComponent, {
    //       data: { absenceId: id },
    //     });
    //     dialogRef.afterClosed().subscribe((response) => {
    //       const date = this.data.date as Date;
    //       this.listAllAbsenceRequestInThisDateOfEmployee(
    //         date,
    //         Number(this.cookieService.get('TimesheetAppEmployeeId'))
    //       );
    //     });
    //   }
    // }
  }
}
