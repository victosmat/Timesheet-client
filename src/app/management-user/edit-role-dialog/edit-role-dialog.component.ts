import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import { PmDto } from 'src/app/model/pm-dto';
import { DepartmentDto } from 'src/app/model/department-dto';
import { RoleDto } from 'src/app/model/role-dto';
@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar) { }

  roles!: RoleDto[];
  ngOnInit(): void {
    console.log(this.data);
    this.getRoles();
  }
  getRoles() {
    this.employeeService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response;
        if (this.data.roles) {
          const roleArr = this.data.roles.split(',');
          this.roles.forEach((element) => {
            element.checked = roleArr.some((role: string | undefined) => {
              if (element.name === role)
                return true;
              return false;
            });
          });
        }
        console.log(this.roles);
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  changeRole(role: RoleDto) {
    role.checked = !role.checked;
    console.log(this.roles);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    const roleIdList = this.roles.filter((role: RoleDto) => role.checked).map((role: RoleDto) => role.id).join(',');
    console.log(roleIdList);
    console.log(this.data.id);
    this.employeeService.editRole(this.data.id, roleIdList).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dialogRef.close();
        this.snackBar.open('Edit role successfully!', 'Close', {
          duration: 2000,
          panelClass: ['green-snackbar'],
        });
      },
      error: (error: any) => {
        console.log(error.status);
        this.snackBar.open('Edit role failed!', 'Close', {
          duration: 2000,
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => { },
    });
  }
}
