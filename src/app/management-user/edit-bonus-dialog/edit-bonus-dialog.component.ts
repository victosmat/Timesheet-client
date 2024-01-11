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
import { DeleteBonusToUserDialogComponent } from './delete-bonus-to-user-dialog/delete-bonus-to-user-dialog.component';
import { SaveBonusToUserDialogComponent } from './save-bonus-to-user-dialog/save-bonus-to-user-dialog.component';

@Component({
  selector: 'app-edit-bonus-dialog',
  templateUrl: './edit-bonus-dialog.component.html',
  styleUrls: ['./edit-bonus-dialog.component.scss']
})
export class EditBonusDialogComponent implements OnInit {

  displayedColumns: string[] = [
    'no',
    'name',
    'dateBonus',
    'reason',
    'gratuity',
    'actions',
  ];

  dataSource: any;
  isCheckboxDisabled = true;
  bonusForUserDTO!: BonusForUserDto;

  constructor(
    public dialogRef: MatDialogRef<EditBonusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
   }

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

  editBonus(element: any) {
    this.dialog
      .open(SaveBonusToUserDialogComponent, {
        data: {
          bonus: element,
          employee: this.data
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.getAllBonusForUser();
        },
      });
  }

  delete(element: any) {
    this.dialog.open(DeleteBonusToUserDialogComponent, {
      data: {
        bonus: element,
        employee: this.data,
      },
      width: '500px',
    }).afterClosed().subscribe({
      complete: () => {
        this.getAllBonusForUser();
      },
    });
  }

  addBonus() {
    this.dialog
      .open(SaveBonusToUserDialogComponent, {
        data: {
          bonus: this.bonusForUserDTO,
          employee: this.data,
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe({
        next: () => {
          this.getAllBonusForUser();
        },
      });
  }
  searchOrFilter() {
    this.getAllBonusForUser();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
