import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { de, is } from 'date-fns/locale';
import { CheckinPunishmentDto } from '../model/checkin-punishment-dto';
import { TimesheetService } from '../service/timesheet/timesheet.service';
import { ReplyCommentComponent } from './reply-complain/reply-comment.component';
import { UpdateIsDeletedComponent } from './update-is-deleted/update-is-deleted.component';

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

  dataSource: any = new MatTableDataSource();
  dataSourceDetail: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
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
    this.getAllCheckinAndPunishment();
  }
  findYearPer() {
    this.getAllCheckinAndPunishment();
  }
  findBranch() {
    this.getAllCheckinAndPunishment();
  }

  renderPage() {
    this.getAllCheckinAndPunishment();
  }

  getAllCheckinAndPunishment() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    const month = this.month;
    const year = this.year;
    const departmentName = this.branchUser === 'ALL' ? '' : this.branchUser;
    const keyword = this.keyword;
    this.employeeService
      .getAllCheckinAndPunishment(
        keyword, month, year, departmentName,
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
            return;
          }
          this.dataSource = new MatTableDataSource(response);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageSize = $event.pageSize;
    this.renderPage();
  }

  sortData($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
    this.renderPage();
  }

  searchOrFilter() { }
  viewCheckInDetail(element: any) {
    this.checkViewDeital = true;
    this.fullNameViewDetail = element.fullName;
    this.emailViewDetail = element.email;
    this.departmentNameViewDetail = element.departmentName;
    this.employeeIdInViewDetail = element.id;
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
      .getCheckinOfEmployeeAndPunishment(employeeId, status, month, year, isComplain)
      .subscribe({
        next: (response) => {
          this.checkinPunishmentDto = response;
          this.dataSourceDetail = new MatTableDataSource(response);
          console.log(this.dataSourceDetail);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => { },
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
  updateReject(item: any) { }
  updateCheckPoint(item: any) { }
  findStatus(){
    this.getCheckinOfEmployeeAndPunishment();
  }
  findComplain(){
    this.getCheckinOfEmployeeAndPunishment();
  }
}