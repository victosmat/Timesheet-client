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
import { Observable } from 'rxjs';
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
    public dialogRef: MatDialogRef<ViewPunishmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private timesheetService: TimesheetService
  ) { }

  findMonthPer() { }
  findYear() { }
  ngOnInit() {
    console.log(this.data);
    this.viewCheckInDetail();
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageNumber = $event.pageIndex;
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
    this.getCheckinOfEmployeeAndPunishment();
  }

  getCheckinOfEmployeeAndPunishment() {
    const status = this.statusPunishment === 'ALL' ? '' : this.statusPunishment;
    const month = this.month - 1;
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
    this.timesheetService
      .getCheckinOfEmployeeAndPunishment(this.pageNumber + 1,
        this.pageSize,
        this.sortField,
        this.sortOrder,employeeId, status, month, year, isComplain)
      .subscribe({
        next: (response) => {
          this.checkinPunishmentDto = response;
          this.data$ = response.content;
          this.dataSource = new CustomDataSource(this.data$);
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
    this.getCheckinOfEmployeeAndPunishment();
  }
  findComplain() {
    this.getCheckinOfEmployeeAndPunishment();
  }
}
