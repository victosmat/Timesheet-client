import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDataSource } from 'src/app/shared/custom-datasource';
import { BonusForUserDto } from 'src/app/model/bonus-for-user';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-view-bonus-dialog',
  templateUrl: './view-bonus-dialog.component.html',
  styleUrls: ['./view-bonus-dialog.component.scss']
})
export class ViewBonusDialogComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'name',
    'dateBonus',
    'reason',
    'gratuity'
  ];

  dataSource: any;
  isCheckboxDisabled = true;
  bonusForUserDTO!: BonusForUserDto;

  constructor(
    public dialogRef: MatDialogRef<ViewBonusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.getAllBonusForUser();
  }

  getAllBonusForUser() {
    this.employeeService
      .getAllBonusForUser(this.data.id)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.dataSource = new CustomDataSource(response);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  formatDate(dateArr: any) {
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }
  searchOrFilter() {
    this.getAllBonusForUser();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
