import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckinPunishmentDto } from 'src/app/model/checkin-punishment-dto';
import { AbsenceService } from 'src/app/service/absence/absence.service';
import { CustomDataSource } from 'src/app/shared/custom-datasource';
import { Observable } from 'rxjs';
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

  selectedDate = new Date();
  data$: any = Observable<any[]>;
  dataSource: any;
  dataSourceDetail: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  isCheckboxDisabled = true;
  date = new Date();
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
    private snackBar: MatSnackBar,
    private absenceService: AbsenceService
  ) {
    const currentMonth = this.selectedDate.getMonth() + 1;
    this.monthPer = (this.selectedDate.getMonth() === 0) ? 12 : this.selectedDate.getMonth() + 1;
    this.yearPer = (currentMonth === 1) ? this.selectedDate.getFullYear() - 1 : this.selectedDate.getFullYear();
  }

  findMonthPer() {
    this.getAbsenceDaysListOfParticularMonth();
  }
  findYear() {
    this.getAbsenceDaysListOfParticularMonth();
  }
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
    const status = this.statusPunishment === 'ALL' ? '' : this.statusPunishment;
    const month = this.monthPer;
    const year = this.yearPer;
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
      .listAllAbsenceRequestInMonthAndYearOfEmployee(this.pageNumber + 1,
        this.pageSize,
        this.sortField,
        this.sortOrder, month, year, status, employeeId)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
          this.checkinPunishmentDto = response.content;
          this.data$ = response.content;
          this.dataSourceDetail = new CustomDataSource(this.data$);
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

  formatDate(dateList: any) {
    return dateList[2] + '-' + dateList[1] + '-' + dateList[0];
  }

  backToView() {
    this.dialogRef.close();
  }
  findStatus() {
    this.getAbsenceDaysListOfParticularMonth();
  }
}
