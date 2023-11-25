import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { BonusDto } from 'src/app/model/bonus-dto';
import { JobDepartmentDto } from 'src/app/model/job-department-dto';
import { EmployeeService } from 'src/app/service/employee/employee.service';
@Component({
  selector: 'app-save-bonus',
  templateUrl: './save-bonus.component.html',
  styleUrls: ['./save-bonus.component.scss']
})
export class SaveBonusComponent implements OnInit {

  bonusForm!: FormGroup;
  bonusDto: BonusDto = {};

  constructor(
    public dialogRef: MatDialogRef<SaveBonusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private snalBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.bonusForm = this.formBuilder.group({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      gratuity: new FormControl(0, Validators.required),
    });
    if (this.data.id !== undefined) {
      this.employeeService.getBonusById(this.data.id).subscribe({
        next: (response: any) => {
          this.bonusDto = response;
          this.bonusForm.patchValue({
            name: this.bonusDto.name,
            description: this.bonusDto.description,
            gratuity: this.bonusDto.gratuity
          });
        },
        error: (error: any) => {
          console.log(error);
          this.dialogRef.close();
          this.snalBar.open('Save failed', 'OK', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  submitForm() {
    if (this.bonusForm.valid) {
      this.bonusDto.id = this.data.id;
      this.bonusDto.name = this.bonusForm.value.name;
      this.bonusDto.description = this.bonusForm.value.description;
      this.bonusDto.gratuity = this.bonusForm.value.gratuity;
      console.log(this.bonusForm.value);
      this.employeeService.saveBonus(this.bonusDto).subscribe({
        next: (response: any) => {
          console.log(response);
          this.dialogRef.close(response);
          this.snalBar.open('Save successfully', 'OK', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error: any) => {
          console.log(error);
          this.dialogRef.close();
          this.snalBar.open('Save failed', 'OK', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
    else {
      this.snalBar.open('Please fill in all fields', 'OK', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
