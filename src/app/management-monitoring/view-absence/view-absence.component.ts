import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckinPunishmentDto } from 'src/app/model/checkin-punishment-dto';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';
import { AbsenceService } from 'src/app/service/absence/absence.service';
@Component({
  selector: 'app-view-absence',
  templateUrl: './view-absence.component.html',
  styleUrls: ['./view-absence.component.scss']
})
export class ViewAbsenceComponent implements OnInit {

  displayedColumnsDetals: string[] = [
    'no',
    'fullName',
    'reason',
    'dateRequest',
    'dateSubmit',
    'typeTimeOff',
    'timeOff',
    'status',
    'punishmentStatus'
  ];

  dataSource: any = new MatTableDataSource();
  dataSourceDetail: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
  pageSize = 5;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  isCheckboxDisabled = true;
  date = new Date();
  month: number = this.date.getMonth() + 1;
  year: number = this.date.getFullYear();
  monthPer: number = this.date.getMonth() + 1;
  yearPer: number = this.date.getFullYear();
  branchUser: string = 'ALL';
  statusPunishment: string = 'ALL';
  complainPunishment: string = 'ALL';
  fullNameViewDetail: string | undefined;
  emailViewDetail: string | undefined;
  departmentNameViewDetail: string | undefined;
  checkViewDeital: boolean = false;
  checkinPunishmentDto: CheckinPunishmentDto[] = [];

  employeeIdInViewDetail: number = 0;


  constructor(
    public dialogRef: MatDialogRef<ViewAbsenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private absenceService: AbsenceService
  ) { }

  findMonthPer() { }
  findYear() { }
  ngOnInit() {
    this.viewCheckInDetail();
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageSize = $event.pageSize;
  }

  sortData($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
  }

  searchOrFilter() { }
  viewCheckInDetail() {
    this.checkViewDeital = true;
    this.fullNameViewDetail = this.data.fullName;
    this.emailViewDetail = this.data.email;
    this.departmentNameViewDetail = this.data.departmentName;
    this.employeeIdInViewDetail = this.data.id;
    this.getAbsenceDaysListOfParticularMonth();
  }

  getAbsenceDaysListOfParticularMonth() {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    const status = this.statusPunishment === 'ALL' ? '' : this.statusPunishment;
    const month = this.month;
    const year = this.year;
    const employeeId = this.employeeIdInViewDetail;
    this.employeeIdInViewDetail = employeeId;
    let isComplain = null;
    if (this.complainPunishment === 'COMPLAIN') {
      isComplain = true;
    }
    if (this.complainPunishment === 'NOT COMPLAIN') {
      isComplain = false;
    }
    this.absenceService
      .listAllAbsenceRequestInMonthAndYearOfEmployee(this.pageNumber,
        this.pageSize,
        this.sortField,
        this.sortOrder, month, year, employeeId)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
            this.dialogRef.close();
            return;
          }
          this.checkinPunishmentDto = response.content;
          this.dataSourceDetail = new MatTableDataSource(response.content);
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
          console.log(this.dataSourceDetail);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => { },
      });
  }

  backToView() {
    this.dialogRef.close();
  }

  showDialogNotComment(item: any) { }

  updateReject(item: any) { }
  updateCheckPoint(item: any) { }
  findStatus() {
    this.getAbsenceDaysListOfParticularMonth();
  }
  findComplain() {
    this.getAbsenceDaysListOfParticularMonth();
  }
}
