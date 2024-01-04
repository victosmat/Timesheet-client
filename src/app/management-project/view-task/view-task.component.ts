import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ProjectService } from 'src/app/service/project/project.service';
import { SaveTaskComponent } from './save-task/save-task.component';
import { TaskDetailDto } from 'src/app/model/task-detail-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CustomDataSource } from 'src/app/shared/custom-datasource';
import { DeleteTaskComponent } from './delete-task/delete-task.component';
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
})
export class ViewTaskComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'name',
    'description',
    'taskType',
    'taskStatus',
    'priorityType',
    'actions',
  ];

  data$: any = Observable<any[]>;
  dataSource: any;
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 0;
  pageSize = 5;
  nameSearch = '';
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  isCheckboxDisabled = true;
  taskDetailDto: TaskDetailDto = {};
  taskForm!: FormGroup;
  typeList: string[] = ['ALL', 'FEATURE', 'BUG', 'COMMON'];
  statusList: string[] = ['ALL', 'NEW', 'CODING', 'COMMITTED', 'DONE'];
  priorityList: string[] = ['ALL', 'VERY_LOW', 'LOW', 'HIGH', 'VERY_HIGH'];

  constructor(
    public dialogRef: MatDialogRef<ViewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.renderPage();
  }

  onchangeType() {
    this.getAllTask();
  }
  onchangeStatus() {
    this.getAllTask();
  }
  onchangePriority() {
    this.getAllTask();
  }

  renderPage() {
    this.taskForm = new FormGroup({
      type: new FormControl('ALL'),
      status: new FormControl('ALL'),
      priority: new FormControl('ALL'),
      keyword: new FormControl(''),
    });

    this.getAllTask();
  }

  getAllTask() {
    const keyword = this.taskForm.value.keyword;
    const type =
      this.taskForm.value.type === 'ALL' ? '' : this.taskForm.value.type;
    const status =
      this.taskForm.value.status === 'ALL' ? '' : this.taskForm.value.status;
    const priority =
      this.taskForm.value.priority === 'ALL'
        ? ''
        : this.taskForm.value.priority;

    this.projectService
      .getTaskDetails(this.pageNumber + 1, this.pageSize, this.sortField, this.sortOrder,
        this.data.id, keyword, type, status, priority)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.content.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
            this.dialogRef.close();
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

  editTask(element: any) {
    this.dialog
      .open(SaveTaskComponent, {
        data: {
          task: element,
          projectId: this.data.id,
        },
        width: '500px',
      }).afterClosed().subscribe({
        next: () => {
          this.renderPage();
        },
      });
  }
  delete(element: any) {
    this.dialog
      .open(DeleteTaskComponent, {
        data: element,
        width: '350px',
      })
      .afterClosed().subscribe({
        next: () => {
          this.renderPage();
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

  addTask() {
    this.dialog
      .open(SaveTaskComponent, {
        data: this.taskDetailDto,
        width: '500px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.renderPage();
        },
      });
  }
  searchOrFilter() {
    this.getAllTask();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
