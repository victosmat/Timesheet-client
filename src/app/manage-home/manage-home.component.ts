import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from '../service/employee/employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ManageTimesheetComponent } from './manage-timesheet/manage-timesheet.component';
import { ManageAbsenceComponent } from './manage-absence/manage-absence.component';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CheckinService } from '../service/checkin/checkin.service';

@Component({
  selector: 'app-manage-home',
  templateUrl: './manage-home.component.html',
  styleUrls: ['./manage-home.component.scss']
})
export class ManageHomeComponent implements OnInit {
  displayedColumns: string[] = ['no', 'photo', 'fullName', 'jobDepartment', 'department', 'actions'];
  dataSource: any = new MatTableDataSource();
  buddyId = Number(this.cookieService.get("TimesheetAppEmployeeId"));
  pageNumber = 0;
  pageSize = 10;
  nameSearch = '';
  sortField = "id";
  sortOrder = "asc";
  totalElements = 0;
  image: any;
  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private checkinService: CheckinService
  ) { }

  ngOnInit() {
    this.renderPage();
  }

  renderPage() {

    const employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
    this.checkinService.getAvatar(employeeId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.image = response;
      },
      error: (error: any) => {
        console.log(error);
      },
    });

    this.employeeService.getStaffPage(this.buddyId, this.pageNumber, this.pageSize, this.nameSearch, this.sortField, this.sortOrder).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response.content);
        this.pageSize = response.pageable.pageSize;
        this.pageNumber = response.pageable.pageNumber;
        this.totalElements = response.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  openTimesheetManage(employeeId: number) {
    const dialoagRef = this.dialog.open(ManageTimesheetComponent, {
      data: { id: employeeId },
    });
  }

  openAbsenceManage(employeeId: number) {
    const dialoagRef = this.dialog.open(ManageAbsenceComponent, {
      data: { id: employeeId },
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

}
