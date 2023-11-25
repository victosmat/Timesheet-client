import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SaveJobDepartmentDialogComponent } from './save-job-department-dialog/save-job-department-dialog.component';
import { el } from 'date-fns/locale';
import { JobDepartmentDto } from '../model/job-department-dto';
import { DeleteJobDepartmentDialogComponent } from './delete-job-department-dialog/delete-job-department-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-management-job-department',
  templateUrl: './management-job-department.component.html',
  styleUrls: ['./management-job-department.component.scss']
})
export class ManagementJobDepartmentComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'Code',
    'Name',
    'Description',
    'Salary range', 
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
  jobDepartmentDto: JobDepartmentDto = {};

  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.renderPage();
  }
  searchOrFilter() {
    this.employeeService.getJobDepartments(this.keyword).subscribe({
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
    this.employeeService.getJobDepartments("").subscribe({
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
  edit(element: any) {
    this.dialog.open(SaveJobDepartmentDialogComponent, {
      width: '500px',
      data: element
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.renderPage();
      }
    });
  }
  delete(element: any) {
    this.dialog.open(DeleteJobDepartmentDialogComponent, {
      width: '500px',
      data: element
    }).afterClosed().subscribe(() => {
      this.renderPage();
    });
  }
  addJobDepartment() {
    this.dialog.open(SaveJobDepartmentDialogComponent, {
      width: '500px',
      data: this.jobDepartmentDto
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.renderPage();
      }
    });
  }
}
