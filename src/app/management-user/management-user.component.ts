import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss'],
})
export class ManagementUserComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'fullName',
    'gender',
    'birthDate',
    'hiringDate',
    'email',
    'buddyName',
    'departmentName',
    'levelStatus',
    'salary',
    'roles',
    'isEnabled',
    'actions',
  ];
  dataSource: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword: string = '';
  isCheckboxDisabled = true;
  levelUser: string = 'ALL';
  IsEnableUser: string = 'ALL';
  typeUser: string = 'ALL';
  branchUser: string = 'ALL';
  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.renderPage();
  }

  findIsEnable() {
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

  getAllUser() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    const isEnable = this.IsEnableUser === 'ALL' ? '' : this.IsEnableUser;
    const level = this.levelUser === 'ALL' ? '' : this.levelUser;
    const type = this.typeUser === 'ALL' ? '' : this.typeUser;
    const branch = this.branchUser === 'ALL' ? '' : this.branchUser;
    this.employeeService
      .getEmployees(
        this.pageNumber,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.keyword,
        isEnable,
        level,
        type,
        branch
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
          this.dataSource = new MatTableDataSource(response.content);
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  editUser(element: any) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.renderPage();
      },
    });
  }
  editRole(element: any) {}
  delete(element: any) {}
  deactivateUser(element: any) {}
  activateUser(element: any) {}

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

  addUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.renderPage();
      },
    });
  }
  searchOrFilter() {
    this.getAllUser();
  }
}
