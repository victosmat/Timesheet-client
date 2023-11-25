import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ProjectService } from '../service/project/project.service';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveProjectComponent } from './save-project/save-project.component';
import { ViewTaskComponent } from './view-task/view-task.component';

@Component({
  selector: 'app-management-project',
  templateUrl: './management-project.component.html',
  styleUrls: ['./management-project.component.scss'],
})
export class ManagementProjectComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'code',
    'name',
    'description',
    'pmName',
    'totalEmployee',
    'startDate',
    'endDate',
    'actions',
  ];

  dataSource: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
  pageSize = 10;
  nameSearch = '';
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  keyword = '';
  status = 'ALL';
  isCheckboxDisabled = true;

  constructor(
    private projectService: ProjectService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.renderPage();
  }

  renderPage() {
    this.projectService.getAllProject(this.status, this.keyword).subscribe({
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
  editProject(element: any) {
    this.dialog
      .open(SaveProjectComponent, {
        data: element,
        width: '1400px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.renderPage();
        },
      });
  }

  updateStatus(status: string){
    console.log(status);
    this.projectService.getAllProject(status, this.keyword).subscribe({
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

  delete(element: any) {}
  viewTask(element: any) {
    this.dialog
      .open(ViewTaskComponent, {
        data: element,
        width: '1400px',
        height: '700px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.renderPage();
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

  saveProject() {
    this.dialog
      .open(SaveProjectComponent, {
        data: {
          id: undefined,
        },
        width: '1400px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.renderPage();
        },
      });
  }
  searchOrFilter() {
    this.projectService.getAllProject(this.status, this.keyword).subscribe({
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
}
