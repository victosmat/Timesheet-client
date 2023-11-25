import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee/employee.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { el } from 'date-fns/locale';
import { JobDepartmentDto } from '../model/job-department-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveBonusComponent } from './save-bonus/save-bonus.component';
import { DeleteBonusComponent } from './delete-bonus/delete-bonus.component';
import { BonusDto } from '../model/bonus-dto';
@Component({
  selector: 'app-management-bonus',
  templateUrl: './management-bonus.component.html',
  styleUrls: ['./management-bonus.component.scss']
})
export class ManagementBonusComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'name',
    'description',
    'gratuity',
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

  bonusDto: BonusDto = {};

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
    this.employeeService.getAllBonus(this.keyword).subscribe({
      next: (response: any) => {
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
    this.employeeService.getAllBonus("").subscribe({
      next: (response: any) => {
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
    this.dialog.open(SaveBonusComponent, {
      width: '500px',
      data: element,
    }).afterClosed().subscribe({
      next: (response: any) => {
        this.renderPage();
      }
    });
  }
  delete(element: any) {
    this.dialog.open(DeleteBonusComponent, {
      width: '500px',
      data: element,
    }).afterClosed().subscribe({
      next: (response: any) => {
        this.renderPage();
      }
    });
  }
  addBonus() {
    this.dialog.open(SaveBonusComponent, {
      data: this.bonusDto,
      width: '500px',
    }).afterClosed().subscribe({
      next: (response: any) => {
        this.renderPage();
        }
    });
  }
}
