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
import { CustomDataSource } from 'src/app/shared/custom-datasource';
@Component({
  selector: 'app-view-punishment',
  templateUrl: './view-punishment.component.html',
  styleUrls: ['./view-punishment.component.scss']
})
export class ViewPunishmentComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'fullName',
    'email',
    'departmentName',
    'countCheckInLate',
    'countNotCheckIn',
    'countNotCheckOut',
  ];

  displayedColumnsDetals: string[] = [
    'no',
    'date',
    'timeCheckin',
    'timeCheckout',
    'status',
    'punishmentTypeDes',
    'punishmentMoney',
    'complain',
    'complainReply',
    'isDeleted'
  ];

  selectedDate = new Date();
  dataSource: any;
  dataSourceDetail: any;
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  isCheckboxDisabled = true;
  date = new Date();
  monthPer: number;
  yearPer: number ;
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
    public dialogRef: MatDialogRef<ViewPunishmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,
    private timesheetService: TimesheetService
  ) {
    const currentMonth = this.selectedDate.getMonth() + 1;
    this.monthPer = (this.selectedDate.getMonth() === 0) ? 12 : this.selectedDate.getMonth() + 1;
    this.yearPer = (currentMonth === 1) ? this.selectedDate.getFullYear() - 1 : this.selectedDate.getFullYear();
   }

  findMonthPer() {
    console.log(this.monthPer);
    this.viewCheckInDetail();
  }
  findYear() { this.viewCheckInDetail() }
  ngOnInit() {
    console.log(this.data);
    this.viewCheckInDetail();
  }

  sortData($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
  }

  searchOrFilter() { this.viewCheckInDetail() }
  viewCheckInDetail() {
    this.checkViewDeital = true;
    this.fullNameViewDetail = this.data.fullName;
    this.emailViewDetail = this.data.email;
    this.departmentNameViewDetail = this.data.departmentName;
    this.employeeIdInViewDetail = this.data.id;
    this.getCheckinOfEmployeeAndPunishment();
  }

  getCheckinOfEmployeeAndPunishment() {
    const status = this.statusPunishment === 'ALL' ? '' : this.statusPunishment;
    const month = this.monthPer - 1;
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
    this.timesheetService
      .getCheckinOfEmployeeAndPunishment(this.pageNumber + 1,
        this.pageSize,
        this.sortField,
        this.sortOrder, employeeId, status, month, year, isComplain, true)
      .subscribe({
        next: (response) => {
          this.checkinPunishmentDto = response;
          console.log(response);
          this.dataSourceDetail = new CustomDataSource(response.content);
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

  findStatus() {
    this.getCheckinOfEmployeeAndPunishment();
  }
  findComplain() {
    this.getCheckinOfEmployeeAndPunishment();
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex;
    this.viewCheckInDetail();
  }
}
