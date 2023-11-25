import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogContainer, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { NoteFormDto } from 'src/app/model/note-form-dto';
import { ProjectSelectDto } from 'src/app/model/project-select-dto';
import { TaskSelectDto } from 'src/app/model/task-select-dto';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

export enum WorkingType {
  ONSITE = "ONSITE" ,
  REMOTE = "REMOTE",
}

export enum TimeSheetStatus {
  NEW = "NEW", 
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECT = "REJECT"
}

@Component({
  selector: 'app-timesheet-dialog',
  templateUrl: './timesheet-dialog.component.html',
  styleUrls: ['./timesheet-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatSelectModule, CommonModule],
  providers: [TimesheetService]
})
export class TimesheetDialogComponent implements OnInit {
  timesheetForm!: FormGroup;
  projectSelectDtoList!: ProjectSelectDto[];
  taskSelectDtoList!: TaskSelectDto[];
  workingTypes = WorkingType;
  noteFormDto: NoteFormDto = {};

  constructor(
    public dialogRef: MatDialogRef<TimesheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private timesheetService: TimesheetService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    const employeeId = Number(this.cookieService.get("TimesheetAppEmployeeId"));

    this.timesheetService.getListProjectForTimesheetForm(employeeId).subscribe({
      next : (response : any) => {
        this.projectSelectDtoList = response;
      },
      error : (error) => {
        this.dialogRef.close();
      },
      complete: () => {

      }
    })

    this.timesheetForm = this.formBuilder.group({
      projectId: new FormControl(null, Validators.required),
      taskId: new FormControl(null, Validators.required),
      note: new FormControl(null, Validators.required),
      workingTime: new FormControl(0, Validators.required),
      workingType: new FormControl(null, Validators.required)
    })

    if(this.data.noteId !== undefined) {
      this.timesheetService.getTimesheetById(this.data.noteId).subscribe({
        next: (response : NoteFormDto) => {
          this.getTaskForFormBasedOnProjectId(response.projectId);
          this.noteFormDto = response;
          this.timesheetForm.patchValue({projectId: response.projectId});
          this.timesheetForm.patchValue({taskId: response.taskId});
          this.timesheetForm.patchValue({note: response.noteDescription});
          this.timesheetForm.patchValue({workingTime: response.workingTime});
          this.timesheetForm.patchValue({workingType: response.workingType});
        },
        error: (error) => {

        },
        complete: () => {

        }
      });
    }
    
  }

  getTaskForFormBasedOnProjectId(projectId : any) {
    this.timesheetService.getListTaskForSelectedProject(projectId).subscribe({
      next : (response : any) => {
        this.taskSelectDtoList = response;
        console.log(this.taskSelectDtoList);
      },
      error : (error) => {
        
      },
      complete: () => {
        
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  submitForm() {
    if(this.data.noteId === undefined) {
      this.noteFormDto.employeeId = this.data.employeeId;
      this.noteFormDto.dateSubmit = this.data.selectedDate;
      this.noteFormDto.status = TimeSheetStatus.NEW;
    }
    this.noteFormDto.projectId = this.timesheetForm.controls["projectId"].value;
    this.noteFormDto.taskId = this.timesheetForm.controls["taskId"].value;
    this.noteFormDto.noteDescription = this.timesheetForm.controls["note"].value;
    this.noteFormDto.workingTime = this.timesheetForm.controls["workingTime"].value;
    this.noteFormDto.workingType = this.timesheetForm.controls["workingType"].value;
    this.noteFormDto.dateModify = new Date();
    console.log(this.noteFormDto);
    this.timesheetService.saveTimesheet(this.noteFormDto).subscribe({
      next : (response) => {
        console.log(response);
      },
      error : (error) => {
        console.log(error);
      }
    });
  }
}
