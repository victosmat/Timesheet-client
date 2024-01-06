import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ProjectService } from '../service/project/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveProjectComponent } from './save-project/save-project.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { Observable } from 'rxjs';
import { CustomDataSource } from '../shared/custom-datasource';
import { DeleteProjectComponent } from './delete-project/delete-project.component';

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
    'status',
    'actions',
  ];

  data$: any = Observable<any[]>;
  dataSource: any;
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
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
  ) { }

  ngOnInit() {
    this.renderPage();
  }

  renderPage() {
    this.getAllProject();
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

  updateStatus(status: string) {
    this.projectService.getAllProject(this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder, status, this.keyword).subscribe({
      next: (response: any) => {
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
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  delete(element: any) {
    this.dialog.open(DeleteProjectComponent, {
      data: element,
      width: '500px',
    }).afterOpened().subscribe({
      next: () => {
        this.renderPage();
      }
    });
  }

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
    console.log($event);
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex;
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
  getAllProject() {
    this.projectService.getAllProject(this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder, this.status, this.keyword).subscribe({
      next: (response: any) => {
        if (response.content.length === 0) {
          this.snackBar.open('No data', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          return;
        }
        console.log(response.content);
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
  searchOrFilter() {
    console.log(this.keyword);
    this.getAllProject();
  }

  updateStatusProject(element: any, status: string) {
    this.projectService.updateStatusProject(element.id, status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open('Update status success', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
        this.renderPage();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
