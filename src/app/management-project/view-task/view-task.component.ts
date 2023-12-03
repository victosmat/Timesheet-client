import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ProjectService } from 'src/app/service/project/project.service';
import { MatInput } from '@angular/material/input';
import { SaveTaskComponent } from './save-task/save-task.component';
import { TaskDetailDto } from 'src/app/model/task-detail-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  dataSource: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
  pageNumber = 1;
  pageSize = 10;
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
    this.pageNumber = 1;
    this.pageSize = 10;
    this.nameSearch = '';
    this.sortField = 'id';
    this.sortOrder = 'asc';

    this.taskForm = new FormGroup({
      type: new FormControl('ALL'),
      status: new FormControl('ALL'),
      priority: new FormControl('ALL'),
      keyword: new FormControl(''),
    });

    this.getAllTask();
  }

  getAllTask() {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.sortField = 'id';
    this.sortOrder = 'asc';

    const keyword = this.taskForm.value.keyword;
    const type =
      this.taskForm.value.type === 'ALL' ? '' : this.taskForm.value.type;
    const status =
      this.taskForm.value.status === 'ALL' ? '' : this.taskForm.value.status;
    const priority =
      this.taskForm.value.priority === 'ALL'
        ? ''
        : this.taskForm.value.priority;

    console.log('keyword: ' + keyword);
    console.log('type: ' + type);
    console.log('status: ' + status);
    console.log('priority: ' + priority);

    this.projectService
      .getTaskDetails(this.pageNumber, this.pageSize, this.sortField, this.sortOrder,
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
          this.dataSource = new MatTableDataSource(response.content);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  editTask(element: any) {
    this.dialog
      .open(SaveTaskComponent, {
        data: element,
        width: '500px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.renderPage();
        },
      });
  }
  updateStatus(element: any) { }
  delete(element: any) { }
  deactivateUser(element: any) { }
  activateUser(element: any) { }

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
