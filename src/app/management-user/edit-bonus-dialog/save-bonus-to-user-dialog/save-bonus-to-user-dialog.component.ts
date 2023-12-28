import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BonusDto } from 'src/app/model/bonus-dto';
import { BonusForUserDto } from 'src/app/model/bonus-for-user';
import { EmployeeService } from 'src/app/service/employee/employee.service';
@Component({
  selector: 'app-save-bonus-to-user-dialog',
  templateUrl: './save-bonus-to-user-dialog.component.html',
  styleUrls: ['./save-bonus-to-user-dialog.component.scss']
})
export class SaveBonusToUserDialogComponent implements OnInit {

  bonusForUserForm!: FormGroup;
  bonusDto: BonusDto = {};
  bonusDtoList: BonusDto[] = [];
  dataSource: any;

  constructor(
    public dialogRef: MatDialogRef<SaveBonusToUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.employeeService.getAllBonus("").subscribe({
      next: (response: any) => {
        this.bonusDtoList = response;
        console.log(this.bonusDtoList);
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

    this.bonusForUserForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      reason: new FormControl(null, Validators.required),
    });

    console.log("bonus id: " + this.data.bonus?.bonusId);

    if (this.data.bonus !== undefined) {
      this.bonusForUserForm.patchValue({
        id: this.data.bonus.bonusId,
        reason: this.data.bonus.reason,
      });
    }
  }


  submitFrom() {
    if (this.bonusForUserForm.invalid) {
      this.snackBar.open('Please fill out all the required fields', 'Close', {
        duration: 2000,
      });
    } else {
      const employeeBonusSaveDto = {
        id: (this.data.bonus !== undefined) ? this.data.bonus.id : null,
        reason: this.bonusForUserForm.value.reason,
        employeeId: this.data.employee.id,
        bonusId: this.bonusForUserForm.value.id,
      }
      this.employeeService.saveBonusToUser(employeeBonusSaveDto).subscribe({
        next: (response: any) => {
          console.log(response);
          this.snackBar.open('Save bonus to user successfully', 'Close', {
            duration: 2000,
          });
          this.dialogRef.close();
        },
        error: (error: any) => {
          console.log(error);
          this.snackBar.open('Save bonus to user failed', 'Close', {
            duration: 2000,
          });
        }
      })
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
