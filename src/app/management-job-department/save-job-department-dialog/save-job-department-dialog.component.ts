import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { JobDepartmentDto } from 'src/app/model/job-department-dto';
import { EmployeeService } from 'src/app/service/employee/employee.service';

@Component({
  selector: 'app-save-job-department-dialog',
  templateUrl: './save-job-department-dialog.component.html',
  styleUrls: ['./save-job-department-dialog.component.scss']
})
export class SaveJobDepartmentDialogComponent implements OnInit {

  jobDepartmentForm!: FormGroup;
  jobDepartmentDto!: JobDepartmentDto;

  constructor(
    public dialogRef: MatDialogRef<SaveJobDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private snalBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.jobDepartmentForm = this.formBuilder.group({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      salaryRange: new FormControl(0, Validators.required),
    });
    if (this.data.id !== undefined){
      this.employeeService.getJobDepartmentById(this.data.id).subscribe({
        next: (response: any) => {
          this.jobDepartmentDto = response;
          console.log(this.jobDepartmentDto);
          this.jobDepartmentForm.patchValue({
            code: this.jobDepartmentDto.jobDepartment,
            name: this.jobDepartmentDto.name,
            description: this.jobDepartmentDto.description,
            salaryRange: this.jobDepartmentDto.salaryRange
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
    if (this.jobDepartmentForm.valid) {
        this.jobDepartmentDto = {
          id: this.data.id,
          jobDepartment: this.jobDepartmentForm.value.code,
          name: this.jobDepartmentForm.value.name,
          description: this.jobDepartmentForm.value.description,
          salaryRange: this.jobDepartmentForm.value.salaryRange
        };
        console.log(this.jobDepartmentDto);
        this.employeeService.saveJobDepartment(this.jobDepartmentDto).subscribe({
          next: (response: any) => {
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
