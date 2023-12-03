import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetStatus } from 'src/app/my-timesheet/my-timesheet.component';
import { TimesheetService } from '../service/timesheet/timesheet.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NoteDetailDto } from '../model/note-detail-dto';
import { EmployeeDto } from '../model/EmployeeDto';
import { NoteDetailViewDto } from '../model/NoteDetailViewDto';
import { MatDialog } from '@angular/material/dialog';
import { CommentNoteComponent } from './comment-note/comment-note.component';

@Component({
  selector: 'app-management-timesheet',
  templateUrl: './management-timesheet.component.html',
  styleUrls: ['./management-timesheet.component.scss'],
})
export class ManagementTimesheetComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  allComplete: boolean = false;
  timesheetForm!: FormGroup;
  noteDetailDtoList!: NoteDetailDto[];
  monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  statusList = [
    'ALL',
    TimeSheetStatus.PENDING,
    TimeSheetStatus.APPROVED,
    TimeSheetStatus.REJECT,
  ];
  displayedColumns: string[] = [
    'dateModify',
    'note',
    'status',
    'workingType',
    'workingTime',
  ];
  selectedFirstDateInWeek: Date = new Date();
  selectedLastDateInWeek: Date = new Date();
  yearList = [
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
    2027, 2028, 2029, 2030,
  ];
  monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  status = 'ALL';
  emailKeyword = '';

  constructor(
    private timesheetService: TimesheetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cookieService: CookieService
  ) {}

  searchEmailKeyword() {
    this.ngOnInit();
  }

  updateStatus(status: string | undefined) {
    if (status === undefined) {
      this.snackBar.open('Error', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    let statusResult = null;
    if (status !== 'ALL') statusResult = status;
    this.timesheetService.getAllNote(statusResult, null, null, this.emailKeyword).subscribe({
      next: (response: any) => {
        this.noteDetailDtoList = response;
        this.noteDetailDtoList.forEach((noteDetailDto) => {
          noteDetailDto.completed = false;
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            employeeDto.completed = false;
            employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
              if (noteDetailViewDto.status === TimeSheetStatus.APPROVED) {
                noteDetailViewDto.completed = true;
              } else {
                noteDetailViewDto.completed = false;
              }
            });
          });
        });
      },
      error: (error) => {
        this.snackBar.open('Error', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      },
      complete: () => {},
    });
  }

  ngOnInit(): void {
    this.selectedFirstDateInWeek.setDate(
      this.selectedFirstDateInWeek.getDate() -
      this.selectedFirstDateInWeek.getDay()
    );
    this.selectedLastDateInWeek.setDate(
      this.selectedLastDateInWeek.getDate() +
      (6 - this.selectedLastDateInWeek.getDay())
    );

    this.range.controls['start'].setValue(this.selectedFirstDateInWeek);
    this.range.controls['end'].setValue(this.selectedLastDateInWeek);

    const status = null;
    if (this.status !== 'ALL') status === this.status;
    this.timesheetService.getAllNote(status, null, null, this.emailKeyword).subscribe({
      next: (response: any) => {
        console.log(response);
        this.noteDetailDtoList = response;
        if(response.length === 0) {
          this.snackBar.open('No data', 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          return;
        }
        this.noteDetailDtoList.forEach((noteDetailDto) => {
          noteDetailDto.completed = true;
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            employeeDto.completed = true;
            employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
              if (noteDetailViewDto.status === TimeSheetStatus.APPROVED) {
                noteDetailViewDto.completed = true;
              } else {
                noteDetailViewDto.completed = false;
                employeeDto.completed = false;
                noteDetailDto.completed = false;
              }
            });
          });
        });
      },
      error: (error) => {
        this.snackBar.open('Error', 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      },
      complete: () => {},
    });
  }

  updateAllCompleteProject(noteDetailDtoCheck: NoteDetailDto | undefined) {
    if (noteDetailDtoCheck?.completed == true) {
      let check = true;
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        if (noteDetailDto.completed == false) {
          check = false;
        }
        if (noteDetailDto.projectId === noteDetailDtoCheck?.projectId) {
          noteDetailDto.completed = true;
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            employeeDto.completed = true;
            employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
              noteDetailViewDto.completed = true;
            });
          });
        }
      });
      if (check) {
        this.allComplete = true;
      }
    } else {
      this.allComplete = false;
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        if (noteDetailDto.projectId === noteDetailDtoCheck?.projectId) {
          noteDetailDto.completed = false;
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            employeeDto.completed = false;
            employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
              noteDetailViewDto.completed = false;
            });
          });
        }
      });
    }
  }

  updateAllCompleteEmployee(employeeDtoCheck: EmployeeDto | undefined) {
    if (employeeDtoCheck?.completed == true) {
      employeeDtoCheck.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
        noteDetailViewDto.completed = true;
      });
      let notecheck: NoteDetailViewDto | undefined;
      employeeDtoCheck.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
        notecheck = noteDetailViewDto;
      });
      let check = true;
      let projectId: number | undefined;
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
          employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
            if (noteDetailViewDto.noteId === notecheck?.noteId) {
              projectId = noteDetailDto.projectId;
              return;
            }
          });
        });
      });
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        if (noteDetailDto.projectId === projectId) {
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            if (!employeeDto.completed) {
              check = false;
              return;
            }
          });
        }
      });
      if (check) {
        this.noteDetailDtoList.forEach((noteDetailDto) => {
          if (noteDetailDto.projectId === projectId) {
            noteDetailDto.completed = true;
            return;
          }
        });
      }
    } else {
      employeeDtoCheck?.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
        noteDetailViewDto.completed = false;
      });
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
          if (employeeDto.employeeId === employeeDtoCheck?.employeeId) {
            noteDetailDto.completed = false;
          }
        });
      });
    }
  }

  updateAllCompleteNote(noteDetailViewDto: NoteDetailViewDto | undefined) {
    if (noteDetailViewDto?.completed == true) {
      let check = true;
      let projectId: number | undefined;
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
          employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
            if (noteDetailViewDto.noteId === noteDetailViewDto?.noteId) {
              projectId = noteDetailDto.projectId;
              return;
            }
          });
        });
      });
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        if (noteDetailDto.projectId === projectId) {
          noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
            employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
              if (!noteDetailViewDto.completed) {
                check = false;
                return;
              }
            });
          });
        }
      });
    } else {
      this.noteDetailDtoList.forEach((noteDetailDto) => {
        noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
          employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
            if (noteDetailViewDto.noteId === noteDetailViewDto?.noteId) {
              noteDetailDto.completed = false;
              return;
            }
          });
        });
      });
    }
  }

  onProjectViewClick(projectId: number | undefined) {}

  updateAllComplete() {
    this.allComplete =
      this.noteDetailDtoList != null &&
      this.noteDetailDtoList.every((t) => t.completed);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.noteDetailDtoList == null) {
      return;
    }
    this.noteDetailDtoList.forEach((noteDetailDto) => {
      noteDetailDto.completed = completed;
      noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
        employeeDto.completed = completed;
        employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
          noteDetailViewDto.completed = completed;
        });
      });
    });
  }

  submitForm() {}

  refresh() {}

  approve() {
    let noteDetailViewDtoList: NoteDetailViewDto[] = [];
    this.noteDetailDtoList.forEach((noteDetailDto) => {
      noteDetailDto.employeeDtoList?.forEach((employeeDto) => {
        employeeDto.noteDetailViewDtos?.forEach((noteDetailViewDto) => {
          if (
            noteDetailViewDto.completed &&
            noteDetailViewDto.status === TimeSheetStatus.PENDING
          ) {
            noteDetailViewDtoList.push(noteDetailViewDto);
            const noteId = noteDetailViewDto.noteId as number;
            this.timesheetService
              .updateTimesheetStatus(noteId, TimeSheetStatus.APPROVED)
              .subscribe({
                next: (response: any) => {
                  this.snackBar.open('Approve success', 'Close', {
                    duration: 2000,
                    panelClass: ['success-snackbar'],
                  });
                  this.ngOnInit();
                },
                error: (error: any) => {
                  this.snackBar.open('Approve fail', 'Close', {
                    duration: 2000,
                    panelClass: ['error-snackbar'],
                  });
                },
              });
          }
        });
      });
    });
  }

  reject() {}

  showDialogComment(noteView: NoteDetailViewDto) {
    if (
      noteView.status === TimeSheetStatus.APPROVED ||
      noteView.status === TimeSheetStatus.REJECT
    ) {
      this.dialog
        .open(CommentNoteComponent, {
          data: noteView,
          width: '400px',
        })
        .afterClosed()
        .subscribe({
          next: () => {
            this.ngOnInit();
          },
        });
    } else {
      this.snackBar.open('This note is not approved or reject', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  updateTaskStatus(noteView: NoteDetailViewDto) {}
}
