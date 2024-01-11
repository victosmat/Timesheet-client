import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentDto } from 'src/app/model/department-dto';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-save-department',
  templateUrl: './save-department.component.html',
  styleUrls: ['./save-department.component.scss'],
})
export class SaveDepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  departmentDto!: DepartmentDto;

  constructor(
    public dialogRef: MatDialogRef<SaveDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private snalBar: MatSnackBar
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data.id);
    
    this.departmentForm = this.formBuilder.group({
      name: new FormControl(null, Validators.required),
    });

    if (this.data.id !== undefined) {
      this.employeeService.getDepartmentsById(this.data.id).subscribe({
        next: (response: any) => {
          this.departmentDto = response;
          this.departmentForm.patchValue({
            name: this.departmentDto.name,
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }
  submitForm() {
    if (this.departmentForm.valid) {
      this.departmentDto = {
        id: this.data.id,
        name: this.departmentForm.value.name,
      };
      this.employeeService.saveDepartment(this.departmentDto).subscribe({
        next: (response: any) => {
          console.log(response);
          this.dialogRef.close();
          this.snalBar.open('Save department successfully', 'Close', {
            duration: 2000,
          });
        },
        error: (error: any) => {
          console.log(error);
          this.snalBar.open('Save department failed', 'Close', {
            duration: 2000,
          });
        },
      });
    } else {
      this.snalBar.open('Please fill in all required fields', 'Close', {
        duration: 2000,
      });
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
