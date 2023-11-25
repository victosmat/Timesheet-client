import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  dataSource: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  levelUser: string = 'ALL';
  paymentStatusUser: string = 'ALL';
  typeUser: string = 'ALL';
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
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    let payStatus = '';
    if (this.paymentStatusUser === 'PAID') {
      payStatus = "true";
    } else if (this.paymentStatusUser === 'UNPAID') {
      payStatus = "false";
    }
  
    const level = this.levelUser === 'ALL' ? '' : this.levelUser;
    const type = this.typeUser === 'ALL' ? '' : this.typeUser;
    const branch = this.branchUser === 'ALL' ? '' : this.branchUser;
    
    this.employeeService
      .getAllPaySlip(
        this.keyword,
        payStatus,
        level,
        type,
        branch,
        this.month,
        this.year,
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
            return;
          }
          this.dataSource = new MatTableDataSource(response.content);
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
  viewPunishmentCheckin(element: any) { }
  viewAbsence(element: any) { }
  viewBonus(element: any) { }
}
