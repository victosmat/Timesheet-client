import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { CustomDataSource } from '../shared/custom-datasource';
import { Observable } from 'rxjs';
import { EditBonusDialogComponent } from './edit-bonus-dialog/edit-bonus-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

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
  data$: any = Observable<any[]>;
  dataSource: any;
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
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
  ) { }

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

  formatDate(dateArr: any) {
    dateArr = dateArr.split('-');
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }

  getAllUser() {
    const isEnable = this.IsEnableUser === 'ALL' ? '' : this.IsEnableUser;
    const level = this.levelUser === 'ALL' ? '' : this.levelUser;
    const type = this.typeUser === 'ALL' ? '' : this.typeUser;
    const branch = this.branchUser === 'ALL' ? '' : this.branchUser;
    this.employeeService
      .getEmployees(
        this.pageNumber + 1,
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
          this.data$ = response.content;
          this.dataSource = new CustomDataSource(this.data$);
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addBonus(element: any) {
    this.dialog.open(EditBonusDialogComponent, {
      data: element,
      width: '900px',
    }).afterClosed().subscribe({
      complete: () => {
        this.renderPage();
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
  editRole(element: any) {
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      data: element,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.renderPage();
      },
    });
  }
  delete(element: any) {
    this.dialog.open(DeleteDialogComponent, {
      data: element,
      width: '500px',
    }).afterClosed().subscribe({
      complete: () => {
        this.renderPage();
      },
    });
  }
  deactivateUser(element: any) {
    console.log(element);
    this.employeeService.deactivateUser(element.id, false).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Deactivate user successfully!', 'Close', {
          duration: 2000,
          panelClass: ['green-snackbar'],
        });
        this.renderPage();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Deactivate user failed!', 'Close', {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => { },
    });
  }
  activateUser(element: any) {
    console.log(element);
    this.employeeService.activateUser(element.id, true).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Deactivate user successfully!', 'Close', {
          duration: 2000,
          panelClass: ['green-snackbar'],
        });
        this.renderPage();
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Deactivate user failed!', 'Close', {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => { },
    });
  }

  loadPage($event: PageEvent) {
    console.log($event);
    this.pageNumber = $event.pageIndex;
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

  viewImage(element: any) { }
}
