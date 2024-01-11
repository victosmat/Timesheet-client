import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogContainer, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { tr } from 'date-fns/locale';
import { CookieService } from 'ngx-cookie-service';
import { NoteFormDto } from 'src/app/model/note-form-dto';
import { ProjectSelectDto } from 'src/app/model/project-select-dto';
import { TaskSelectDto } from 'src/app/model/task-select-dto';
import { TimesheetService } from 'src/app/service/timesheet/timesheet.service';

export enum WorkingType {
  ONSITE = "ONSITE",
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
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const employeeId = Number(this.cookieService.get("TimesheetAppEmployeeId"));

    this.timesheetService.getListProjectForTimesheetForm(employeeId).subscribe({
      next: (response: any) => {
        this.projectSelectDtoList = response;
        console.log(this.projectSelectDtoList);
      },
      error: (error) => {
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

    if (this.data.noteId) {
      console.log("sdsdsdsd");
      this.timesheetService.getTimesheetById(this.data.noteId).subscribe({
        next: (response: NoteFormDto) => {
          this.getTaskForFormBasedOnProjectId(response.projectId);
          console.log(response);
          this.noteFormDto = response;
          console.log("noteFormDto" + this.noteFormDto);
          this.timesheetForm.patchValue({ projectId: response.projectId });
          this.timesheetForm.patchValue({ taskId: response.taskId });
          this.timesheetForm.patchValue({ note: response.noteDescription });
          this.timesheetForm.patchValue({ workingTime: response.workingTime });
          this.timesheetForm.patchValue({ workingType: response.workingType });
        },
        error: (error) => {

        },
        complete: () => {

        }
      });
    }

  }

  getTaskForFormBasedOnProjectId(projectId: any) {
    this.timesheetService.getListTaskForSelectedProject(projectId).subscribe({
      next: (response: any) => {
        this.taskSelectDtoList = response;
        console.log(this.taskSelectDtoList);
      },
      error: (error) => {

      },
      complete: () => {

      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    console.log(this.data.selectedDate);
    if (this.timesheetForm.valid) {
      this.noteFormDto = {
        id: this.data.noteId,
        employeeId: Number(this.cookieService.get("TimesheetAppEmployeeId")),
        projectId: this.timesheetForm.value.projectId,
        taskId: this.timesheetForm.value.taskId,
        noteDescription: this.timesheetForm.value.note,
        workingTime: this.timesheetForm.value.workingTime,
        workingType: this.timesheetForm.value.workingType,
        dateSubmit: this.noteFormDto.dateSubmit,
        dateModify: this.noteFormDto.dateModify,
        status: TimeSheetStatus.NEW,
        createdDate: this.data.selectedDate,
      };
      this.timesheetService.saveTimesheet(this.noteFormDto).subscribe({
        next: (response: any) => {
          this.dialogRef.close(response);
          if (response === true) {
            this.snackBar.open('Save timesheet successfully', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackBar.open('Save timesheet failed', 'Close', {
              duration: 2000,
            });
          }
        },
        error: (error: any) => {
          console.log(error);
          this.snackBar.open('Save timesheet failed', 'Close', {
            duration: 2000,
          });
        },
      });
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 2000,
      });
    }
  }
}
