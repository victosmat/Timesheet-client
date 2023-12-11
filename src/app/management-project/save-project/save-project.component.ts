import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeViews } from 'src/app/model/EmployeeViews';
import { ProjectDetailDto } from 'src/app/model/project-view-detail';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import { ProjectService } from 'src/app/service/project/project.service';

@Component({
  selector: 'app-save-project',
  templateUrl: './save-project.component.html',
  styleUrls: ['./save-project.component.scss'],
})
export class SaveProjectComponent implements OnInit {
  projectFrom!: FormGroup;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  panelMember: Boolean = true;
  panelTeamMember: Boolean = false;
  checkAddMember: Boolean = false;
  keyword = '';
  employeeSelected: any;
  pageNumber = 1;
  pageSize = 10;
  sortField = 'id';
  sortOrder = 'asc';
  totalElements = 0;
  employeeView: EmployeeViews[] = [];
  projectDetailDto: ProjectDetailDto = {};

  constructor(
    public dialogRef: MatDialogRef<SaveProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.projectFrom = this.formBuilder.group({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      projectType: new FormControl('OUTSOURCE', Validators.required),
      projectStatus: new FormControl('ACTIVE', Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      keyword: new FormControl(null),
      keywordSelected: new FormControl(null),
      employeeSelectedList: this.formBuilder.array([]),
    });

    if (this.data.id !== undefined) {
      this.projectService.getProjectDetails(this.data.id).subscribe({
        next: (response: any) => {
          this.projectDetailDto = response;
          console.log(response);
          this.projectFrom.patchValue({
            code: response.code,
            name: response.name,
            description: response.description,
            projectType: response.projectType,
            projectStatus: response.projectStatus,
            start: response.startDate,
            end: response.endDate,
          });
          response.projectEmployeeSaveDtos?.forEach((element: any) => {
            this.employeeSelectedList.push(
              this.formBuilder.group({
                id: new FormControl(null),
                employeeId: new FormControl(
                  element.employeeId,
                  Validators.required
                ),
                name: new FormControl(
                  { value: element.employeeName, disabled: true },
                  Validators.required
                ),
                roles: new FormControl(
                  { value: element.roles, disabled: true },
                  Validators.required
                ),
                email: new FormControl(
                  { value: element.email, disabled: true },
                  Validators.required
                ),
                roleProjectType: new FormControl('MEMBER', Validators.required),
              })
            );
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    this.pageNumber = 1;
    this.pageSize = 10;
    this.keyword = '';
    this.sortField = 'id';
    this.sortOrder = 'asc';
    this.employeeService
      .getEmployees(
        this.pageNumber,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.keyword,
        '',
        '',
        '',
        ''
      )
      .subscribe({
        next: (response: any) => {
          this.employeeView = response.content;
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updateRole(employee: any, i: number) {
    console.log(employee.value);
    console.log(employee);
    console.log(i);
  }

  // addSelectedEmployee() {
  //   this.employeeSelectedList.push(this.createSelectedEmployee());
  // }

  // createSelectedEmployee() {
  //   return this.formBuilder.group({
  //     id: new FormControl(null),
  //     employeeId: new FormControl(null, Validators.required),
  //     name: new FormControl(null, Validators.required),
  //     email: new FormControl(null, Validators.required),
  //     roleProjectType: new FormControl('MEMBER', Validators.required),
  //   });
  // }

  deleteSelectedEmployee(index: number) {
    this.employeeSelectedList.removeAt(index);
  }

  get employeeSelectedList() {
    return this.projectFrom.controls['employeeSelectedList'] as FormArray;
  }

  onNoClick() {
    this.dialogRef.close();
  }
  submitFrom() { }
  addUser() {
    this.checkAddMember = true;
  }
  exitAdd() {
    this.checkAddMember = false;
  }
  searchOrFilterSelectedUser() {
  }

  searchOrFilterUser(){
    
  }

  addUserToTeam(employee: EmployeeViews) {
    let check = false;
    this.employeeSelectedList.controls.forEach((element: any) => {
      if (element.value.employeeId == employee.id) {
        check = true;
        this.snackBar.open('Employee already exist', 'Close', {
          duration: 2000,
        });
        return;
      }
    });
    if (check) return;
    this.employeeSelectedList.push(
      this.formBuilder.group({
        id: new FormControl(null),
        employeeId: new FormControl(employee.id, Validators.required),
        name: new FormControl(
          { value: employee.fullName, disabled: true },
          Validators.required
        ),
        roles: new FormControl(
          { value: employee.roles, disabled: true },
          Validators.required
        ),
        email: new FormControl(
          { value: employee.email, disabled: true },
          Validators.required
        ),
        roleProjectType: new FormControl('MEMBER', Validators.required),
      })
    );
  }

  filter(){
    console.log("sscsccs");
    console.log(this.projectFrom.value.keyword);
    const keyword = this.projectFrom.value.keyword;
    this.pageNumber = 1;
    this.pageSize = 100;
    this.sortField = 'id';
    this.sortOrder = 'asc';
    this.employeeService
      .getEmployees(
        this.pageNumber,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        keyword,
        '',
        '',
        '',
        ''
      )
      .subscribe({
        next: (response: any) => {
          this.employeeView = response.content;
          this.pageSize = response.pageable.pageSize;
          this.pageNumber = response.pageable.pageNumber;
          this.totalElements = response.totalElements;
        },
        error: (error) => {
          console.log(error);
        },
      });
      this.panelTeamMember = true;
  }

  filterSelected(){
    console.log(this.employeeSelectedList.value.keywordSelected);
  }
}
