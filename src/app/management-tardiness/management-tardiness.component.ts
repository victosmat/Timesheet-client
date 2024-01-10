import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CheckinPunishmentDto } from '../model/checkin-punishment-dto';
import { TimesheetService } from '../service/timesheet/timesheet.service';
import { ReplyCommentComponent } from './reply-complain/reply-comment.component';
import { UpdateIsDeletedComponent } from './update-is-deleted/update-is-deleted.component';
import { CustomDataSource } from '../shared/custom-datasource';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { is } from 'date-fns/locale';

@Component({
  selector: 'app-management-tardiness',
  templateUrl: './management-tardiness.component.html',
  styleUrls: ['./management-tardiness.component.scss']
})

export class ManagementTardinessComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'fullName',
    'email',
    'departmentName',
    'countCheckInLate',
    'countNotCheckIn',
    'countNotCheckOut',
    'actions',
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
    'isDeleted',
    'actions'
  ];

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
  isPunishment: string = 'ALL';

  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private timesheetService: TimesheetService
  ) { }

  ngOnInit() {
    this.renderPage();
  }

  findMonth() {
    this.getAllCheckinAndPunishment();
  }
  findYear() {
    this.getAllCheckinAndPunishment();
  }
  findMonthPer() {
    this.getCheckinOfEmployeeAndPunishment();
  }
  findYearPer() {
    this.getCheckinOfEmployeeAndPunishment();
  }
  findBranch() {
    this.getAllCheckinAndPunishment();
  }

  renderPage() {
    this.getAllCheckinAndPunishment();
  }

  getAllCheckinAndPunishment() {
    const month = this.month;
    const year = this.year;
    const departmentName = this.branchUser === 'ALL' ? '' : this.branchUser;
    const keyword = this.keyword;
    this.employeeService
      .getAllCheckinAndPunishment(this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder,
        keyword, month, year, departmentName,
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
          this.dataSource = new CustomDataSource(response.content);
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex;
    this.renderPage();
  }

  sortData($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
    this.renderPage();
  }

  searchOrFilter() { this.getAllCheckinAndPunishment() }
  viewCheckInDetail(element: any) {
    this.checkViewDeital = true;
    this.fullNameViewDetail = element.fullName;
    this.emailViewDetail = element.email;
    this.departmentNameViewDetail = element.departmentName;
    this.employeeIdInViewDetail = element.id;
    this.getCheckinOfEmployeeAndPunishment();
  }

  getCheckinOfEmployeeAndPunishment() {
    console.log(this.monthPer);
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

    let isPunishment = null;
    if (this.isPunishment === 'PUNISHMENT') {
      isPunishment = true;
    }
    if (this.isPunishment === 'NOT PUNISHMENT') {
      isPunishment = false;
    }
    this.timesheetService
      .getCheckinOfEmployeeAndPunishment(this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder, employeeId, status, month, year, isComplain, isPunishment)
      .subscribe({
        next: (response) => {
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
          }
          this.dataSourceDetail = new CustomDataSource(response.content);
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  backToView() {
    this.checkViewDeital = false;
  }

  showDialogNotComment(item: any) { }
  replyComment(item: any) {
    this.dialog.open(ReplyCommentComponent, {
      data: item,
    }).afterClosed().subscribe({
      complete: () => {
        this.getCheckinOfEmployeeAndPunishment();
      },
    });
  }
  updateCancelPunishment(item: any) {
    this.dialog.open(UpdateIsDeletedComponent, {
      data: {
        item: item,
        checkIsDeleted: 1
      }
    }).afterClosed().subscribe({
      complete: () => {
        this.getCheckinOfEmployeeAndPunishment();
      },
    });
  }
  updatePunishment(item: any) {
    this.dialog.open(UpdateIsDeletedComponent, {
      data: {
        item: item,
        checkIsDeleted: 2
      }
    }).afterClosed().subscribe({
      complete: () => {
        this.getCheckinOfEmployeeAndPunishment();
      },
    });
  }
  updateReject(item: any) {
    this.dialog.open(UpdateStatusComponent, {
      data: item
    }).afterClosed().subscribe({
      complete: () => {
        this.getCheckinOfEmployeeAndPunishment();
      },
    });
  }
  updateCheckPoint(item: any) {
    this.dialog.open(UpdateStatusComponent, {
      data: item
    }).afterClosed().subscribe({
      complete: () => {
        this.getCheckinOfEmployeeAndPunishment();
      },
    });
  }
  findStatus() {
    this.getCheckinOfEmployeeAndPunishment();
  }
  findComplain() {
    this.getCheckinOfEmployeeAndPunishment();
  }
  findPunishment() {
    this.getCheckinOfEmployeeAndPunishment();
  }
}
