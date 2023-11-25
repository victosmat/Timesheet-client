import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDepartmentComponent } from './delete-department/delete-department.component';
import { SaveDepartmentComponent } from './save-department/save-department.component';
import { DepartmentDto } from '../model/department-dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-management-department',
  templateUrl: './management-department.component.html',
  styleUrls: ['./management-department.component.scss'],
})
export class ManagementDepartmentComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'Name',
    'Working time morning',
    'Working time afternoon',
    'actions',
  ];
  totalElements = 0;
  dataSource: any = new MatTableDataSource();

  keyword: string = '';
  pageNumber = 1;
  pageSize = 10;
  nameSearch = '';
  sortField = 'id';
  sortOrder = 'asc';
  departmentDto: DepartmentDto = {};

  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.renderPage();
  }
  searchOrFilter() {
    this.employeeService.getDepartments(this.keyword).subscribe({
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
      }
    })
  }

  sortData($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
    this.renderPage();
  }

  loadPage($event: PageEvent) {
    console.log($event.pageSize);
    this.pageSize = $event.pageSize;
    this.renderPage();
  }

  renderPage() {
    this.employeeService.getDepartments("").subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response);
      }
    })
  }
  edit(element: any) {
    this.dialog.open(SaveDepartmentComponent, {
      width: '500px',
      data: element,
    }).afterClosed().subscribe({
      next: (response: any) => {
        console.log(response);
        this.renderPage();
      }
    })
  }
  delete(element: any) {
    this.dialog.open(DeleteDepartmentComponent, {
      width: '500px',
      data: element,
    }).afterClosed().subscribe({
      next: (response: any) => {
        console.log(response);
        this.renderPage();
      }
    })
  }
  addDepartment() {
    this.dialog.open(SaveDepartmentComponent, {
      data: this.departmentDto,
      width: '500px',
    }).afterClosed().subscribe({
      next: (response: any) => {
        console.log(response);
        this.renderPage();
      }
    })
  }
}
