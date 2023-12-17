import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewPunishmentComponent } from './view-punishment/view-punishment.component';
import { ViewAbsenceComponent } from './view-absence/view-absence.component';
import { Observable } from 'rxjs';
import { CustomDataSource } from '../shared/custom-datasource';
@Component({
  selector: 'app-management-monitoring',
  templateUrl: './management-monitoring.component.html',
  styleUrls: ['./management-monitoring.component.scss']
})
export class ManagementMonitoringComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'fullName',
    'email',
    'departmentName',
    'departmentLevelStatus',
    'payDay',
    'totalSalary',
    'paymentStatus',
    'actions',
  ];
  selectedDate = new Date();
  data$: any = Observable<any[]>;
  dataSource: any;
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  levelUser: string = 'ALL';
  paymentStatusUser: string = 'ALL';
  branchUser: string = 'ALL';
  month: number = this.selectedDate.getMonth();
  year: number = this.selectedDate.getFullYear();
  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.renderPage();
  }

  findStatus() {
    this.getAllUser();
  }
  findLevel() {
    this.getAllUser();
  }
  findType() {
    this.getAllUser();
  }
  findBranch() {
    this.getAllUser();
  }

  renderPage() {
    this.getAllUser();
  }
  findMonth() {
    this.getAllUser();
  }

  findYear() {
    this.getAllUser();
  }

  getAllUser() {
    let payStatus = '';
    if (this.paymentStatusUser === 'PAID') {
      payStatus = "true";
    } else if (this.paymentStatusUser === 'UNPAID') {
      payStatus = "false";
    }

    const level = this.levelUser === 'ALL' ? '' : this.levelUser;
    const branch = this.branchUser === 'ALL' ? '' : this.branchUser;

    this.employeeService
      .getAllPaySlip(
        this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder,
        this.keyword,
        payStatus,
        level,
        branch,
        this.month,
        this.year,
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
          this.data$ = response.content;
          this.dataSource = new CustomDataSource(this.data$);
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

  searchOrFilter() {
    this.getAllUser();
  }

  updateStatus(id: number, status: boolean) { }
  viewPunishmentCheckin(element: any) {
    this.dialog.open(ViewPunishmentComponent, {
      data: {
        id: element.id,
        fullName: element.fullName,
        email: element.email,
        departmentName: element.departmentName,
        departmentLevelStatus: element.departmentLevelStatus,
        payDay: element.payDay,
        totalSalary: element.totalSalary,
        paymentStatus: element.paymentStatus,
      },
      width: '1400px',
    }).afterClosed().subscribe({
      next: () => {
        this.renderPage();
      },
    });
  }
  viewAbsence(element: any) {
    this.dialog.open(ViewAbsenceComponent, {
      data: {
        id: element.id,
        fullName: element.fullName,
        email: element.email,
        departmentName: element.departmentName,
        departmentLevelStatus: element.departmentLevelStatus,
        payDay: element.payDay,
        totalSalary: element.totalSalary,
        paymentStatus: element.paymentStatus,
      },
      width: '1400px',
    }).afterClosed().subscribe({
      next: () => {
        this.renderPage();
      },
    });
  }
  viewBonus(element: any) { }
}
