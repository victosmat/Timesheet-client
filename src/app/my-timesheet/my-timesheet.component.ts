import { Component, IterableDiffers, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TimesheetService } from '../service/timesheet/timesheet.service';
import { MatDialog } from '@angular/material/dialog';
import { TimesheetDialogComponent } from './timesheet-dialog/timesheet-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { NotesPerDayDto } from '../model/notes-per-day-dto';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CheckInRequestDto } from '../model/check-in-request-dto';
import { NoteSummaryRequestDto } from '../model/note-summary-request-dto';
import { CheckInDto } from '../model/check-in-dto';
import { SummaryDto } from '../model/summary-dto';
import { NoteSummaryDto } from '../model/note-summary-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteViewDto } from '../model/note-view-dto';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { CheckinPunishmentDto } from '../model/checkin-punishment-dto';
import { ComplainDialogComponent } from './complain-dialog/complain-dialog.component';
import { getISOWeek } from 'date-fns';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD-MM-YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD-MM-YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export enum TimeSheetStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECT = 'REJECT',
}

@Component({
  selector: 'app-my-timesheet',
  templateUrl: './my-timesheet.component.html',
  styleUrls: ['./my-timesheet.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class MyTimesheetComponent implements OnInit, OnChanges {
  daysArray = [
    { label: 'Monday', value: 1, },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 0 },
  ];

  daysArraySummary = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  selectedDate = new Date();
  selectedDay = this.selectedDate.getDay();
  selectedDayIndex = this.getSelectedDayIndex();
  dateString: String = '';
  dates: SummaryDto[] = [];
  checkinPunishmentDto: CheckinPunishmentDto[] = [];

  notesPerDayDtos: NotesPerDayDto[] = [];

  name: string = 'Quang';

  weekNumber: number = this.getWeekNumberOfSelectedDate(new Date());

  monthSummary: number = this.selectedDate.getMonth();
  yearSummary: number = this.selectedDate.getFullYear();
  statusSummary: string = 'ALL';

  statusPunishment: string = 'ALL';
  yearPunishment: number = this.selectedDate.getFullYear();
  monthPunishment: number = this.selectedDate.getMonth();

  checkInRequestDto: CheckInRequestDto = {};
  noteSummaryRequestDto: NoteSummaryRequestDto = {};
  checkInDtoList: CheckInDto[] = [];
  noteSummaryDtoList: NoteSummaryDto[] = [];
  noteViewDto: NoteViewDto[] = [];

  totalHours: number = 0;
  totalOpentalks: number = 0;

  constructor(
    private timesheetService: TimesheetService,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private snackBar: MatSnackBar
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Jump to onChanges');
  }

  ngOnInit(): void {
    this.loadTimesheet();
    this.initSummary();
    this.getCheckinOfEmployeeAndPunishment();
  }

  loadTimesheet() {
    console.log(this.getWeekNumberOfSelectedDate(this.selectedDate));
    this.timesheetService
      .getTimesheetByWeek(
        Number(this.cookieService.get('TimesheetAppEmployeeId')),
        this.getWeekNumberOfSelectedDate(this.selectedDate)
      )
      .subscribe({
        next: (response: any) => {
          this.notesPerDayDtos = response;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => { },
      });
  }

  initSummary() {
    this.dates = this.getAllDatesInMonth(this.yearSummary, this.monthSummary);
    this.checkInRequestDto.employeeId = Number(
      this.cookieService.get('TimesheetAppEmployeeId')
    );
    this.checkInRequestDto.month = this.monthSummary + 1;
    this.checkInRequestDto.year = this.yearSummary;
    this.noteSummaryRequestDto.employeeId = Number(
      this.cookieService.get('TimesheetAppEmployeeId')
    );
    this.noteSummaryRequestDto.month = this.monthSummary + 1;
    this.noteSummaryRequestDto.year = this.yearSummary;
    this.noteSummaryRequestDto.statuses = [
      TimeSheetStatus.APPROVED,
      TimeSheetStatus.NEW,
      TimeSheetStatus.PENDING,
    ];
    this.findSummary(undefined);
  }

  showDialogNotComment(item: CheckinPunishmentDto) {
    const dialogRef = this.dialog.open(ComplainDialogComponent, {
      data: { note: item },
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.ngOnInit();
      },
    });
  }

  getTotalWokingTime() {
    let totalWokingTime = 0;
    let formattedTime = '00:00';
    for (let i = 0; i < 7; i++) {
      let itemList = this.getNotesPerDay(i)?.lst;
      if (itemList !== undefined) {
        for (let item of itemList) {
          if (item.workingTime !== undefined && item.status !== 'REJECT') {
            totalWokingTime += item.workingTime;
          }
        }
      }
    }
    const hours = Math.floor(totalWokingTime);
    const minutes = Math.round((totalWokingTime - hours) * 60);

    formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return formattedTime;
  }

  getWorkingTime(index: any) {
    let itemList = this.getNotesPerDay(index)?.lst;
    if (itemList !== undefined) {
      let totalHours = 0;
      for (let item of itemList) {
        if (item.workingTime !== undefined && item.status !== 'REJECT') {
          totalHours += item.workingTime;
        }
      }

      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      return formattedTime;
    }
    return '00:00';
  }

  checkComment(index: any) {
    let itemResultList = this.getNotesPerDay(index)?.lst;

    if (itemResultList) {
      for (let itemResult of itemResultList) {
        if (itemResult.read === false) return false;
      }
    }

    return true;
  }

  getNotesPerDay(index: any) {
    for (let item of this.notesPerDayDtos) {
      let date: Date = new Date(
        item.dateSubmit[0],
        item.dateSubmit[1] - 1,
        item.dateSubmit[2]
      );
      let dateNumber = date.getDay();
      let currentSelectedDateNumber = this.daysArray[index].value;
      if (dateNumber == currentSelectedDateNumber && item !== null) {
        return item;
      }
    }
    return null;
  }

  formatDate(dateList: number[]) {
    return dateList[2] + ' - ' + dateList[1] + ' - ' + dateList[0];
  }

  getSelectedDayIndex(): number {
    let index = this.selectedDay - 1;
    if (index < 0) index = 6;
    return index;
  }

  getDay(date: Date) {
    return date.getDay();
  }

  getDate(date: Date) {
    return date.getDate();
  }

  getMonth(date: Date) {
    return date.getMonth();
  }

  getYear(date: Date) {
    return date.getFullYear();
  }

  getWeekNumberOfSelectedDate(date: any) {
    return getISOWeek(date);
  }

  // getWeekNumberOfSelectedDate(date: Date) {
  //   console.log(date);
  //   let startDate = new Date(date.getFullYear(), 0, 1);
  //   var days = Math.floor(
  //     (date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
  //   );
  //   var weekNumber = Math.ceil(days / 7);
  //   return weekNumber;
  // }

  getWeekNumberAndUpdateDay(date: any) {
    this.selectedDate = date.toDate();
    this.selectedDay = date._d.getDay();
    this.selectedDayIndex = this.getSelectedDayIndex();
    this.checkLoadTimesheet();
  }

  getAllDatesInMonth(year: number, month: number): SummaryDto[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const dates: SummaryDto[] = [];

    for (
      let i = firstDayOfMonth;
      i <= lastDayOfMonth;
      i.setDate(i.getDate() + 1)
    ) {
      dates.push({
        date: new Date(i),
        checkInDto: null,
        noteSummaryDto: null,
      });
    }

    return dates;
  }

  returnCurrentDay() {
    this.selectedDate = new Date();
    this.selectedDay = this.selectedDate.getDay();
    this.selectedDayIndex = this.getSelectedDayIndex();
    this.checkLoadTimesheet();
  }

  minusOneDay() {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() - 1)
    );
    this.selectedDay = this.selectedDate.getDay();
    this.selectedDayIndex = this.getSelectedDayIndex();
    this.checkLoadTimesheet();
  }

  plusOneDay() {
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() + 1)
    );
    this.selectedDay = this.selectedDate.getDay();
    this.selectedDayIndex = this.getSelectedDayIndex();
    this.checkLoadTimesheet();
  }

  returnSelectedDate(event: MatTabChangeEvent) {
    if (event.index === 7) return;
    let dayNum = this.selectedDate.getDay();
    if (dayNum === 0) dayNum = 7;
    let difference = dayNum - 1 - event.index;
    this.selectedDate = new Date(
      this.selectedDate.setDate(this.selectedDate.getDate() - difference)
    );
    this.selectedDay = this.selectedDate.getDay();
    this.selectedDayIndex = this.getSelectedDayIndex();
    this.checkLoadTimesheet();
  }

  checkLoadTimesheet() {
    if (
      this.weekNumber !== this.getWeekNumberOfSelectedDate(this.selectedDate)
    ) {
      this.weekNumber = this.getWeekNumberOfSelectedDate(this.selectedDate);
      this.loadTimesheet();
    }
  }

  showTimesheetForm(item: number | undefined) {
    const dialogRef = this.dialog.open(TimesheetDialogComponent, {
      data: {
        noteId: item,
        employeeId: this.cookieService.get('TimesheetAppEmployeeId'),
        selectedDate: this.selectedDate,
      },
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.loadTimesheet();
      },
    });
  }

  showDeleteNotify(item: number | undefined) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { noteId: item },
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.loadTimesheet();
      },
    });
  }

  showComment(item: NoteViewDto) {
    console.log(item);
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      data: { note: item },
    });

    dialogRef.afterClosed().subscribe({
      complete: () => {
        this.loadTimesheet();
      },
    });
  }

  submitWeekForApproved() {
    this.timesheetService.submitWeekForApproved(this.weekNumber).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.ngOnInit();
      },
    });
  }

  findPunishment(type: any) {
    if (type === 'YEAR') {
      this.checkInRequestDto.year = this.yearSummary;
      this.noteSummaryRequestDto.year = this.yearSummary;
    }
    if (type == 'MONTH') {
      this.checkInRequestDto.month = this.monthSummary + 1;
      this.noteSummaryRequestDto.month = this.monthSummary + 1;
    }
    this.getCheckinOfEmployeeAndPunishment();
  }

  getCheckinOfEmployeeAndPunishment() {
    const status = (this.statusPunishment === 'ALL' ? '' : this.statusPunishment);
    const month = this.monthPunishment;
    const year = this.yearPunishment;
    const employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));
    this.timesheetService
      .getCheckinOfEmployeeAndPunishment(1, 300, 'id', 'asc', employeeId, status, month, year, null, null)
      .subscribe({
        next: (response) => {
          console.log(response.content);
          this.checkinPunishmentDto = response.content;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => { },
      });
  }

  findSummary(type: any) {
    this.totalHours = 0;
    this.totalOpentalks = 0;
    if (type === 'STATUS') {
      switch (this.statusSummary) {
        case 'ALL': {
          this.noteSummaryRequestDto.statuses = [
            TimeSheetStatus.APPROVED,
            TimeSheetStatus.NEW,
            TimeSheetStatus.PENDING,
          ];
          break;
        }
        case 'NEW': {
          this.noteSummaryRequestDto.statuses = [TimeSheetStatus.NEW];
          break;
        }
        case 'PENDING or APPROVED': {
          this.noteSummaryRequestDto.statuses = [
            TimeSheetStatus.APPROVED,
            TimeSheetStatus.PENDING,
          ];
          break;
        }
        case 'PENDING': {
          this.noteSummaryRequestDto.statuses = [TimeSheetStatus.PENDING];
          break;
        }
        case 'APPROVED': {
          this.noteSummaryRequestDto.statuses = [TimeSheetStatus.APPROVED];
          break;
        }
      }
    }
    if (type === 'YEAR') {
      this.checkInRequestDto.year = this.yearSummary;
      this.noteSummaryRequestDto.year = this.yearSummary;
    }
    if (type == 'MONTH') {
      this.checkInRequestDto.month = this.monthSummary + 1;
      this.noteSummaryRequestDto.month = this.monthSummary + 1;
    }

    this.dates = this.getAllDatesInMonth(this.yearSummary, this.monthSummary);

    this.timesheetService
      .getCheckInSummaryPerMonth(this.checkInRequestDto)
      .subscribe({
        next: (response) => {
          this.checkInDtoList = response;
          this.checkInDtoList.forEach((entry) => {
            const date = new Date(
              entry.checkInTime[0],
              entry.checkInTime[1],
              entry.checkInTime[2],
              entry.checkInTime[3],
              entry.checkInTime[4]
            ).getDate();
            this.dates[date - 1].checkInDto = entry;
          });
        },
        error: (error) => { },
        complete: () => { },
      });

    this.timesheetService
      .getNoteSummaryPerMonth(this.noteSummaryRequestDto)
      .subscribe({
        next: (response) => {
          this.noteSummaryDtoList = response;
          this.noteSummaryDtoList.forEach((entry) => {
            this.totalHours += entry.totalHours;
            const date = new Date(
              entry.date[0],
              entry.date[1],
              entry.date[2]
            ).getDate();
            this.dates[date - 1].noteSummaryDto = entry;
          });
        },
        error: (error) => { },
        complete: () => { },
      });

    this.timesheetService
      .getNumberOfEmployeeOpenTalks(this.checkInRequestDto)
      .subscribe({
        next: (response) => {
          this.totalOpentalks = response;
        },
        error: (error) => { },
        complete: () => { },
      });
  }

  saveCheckpointTime() {
    this.timesheetService
      .saveCheckpointTime(
        Number(this.cookieService.get('TimesheetAppEmployeeId'))
      )
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.snackBar.open('Checkpoint sucessfully!', 'OK', {
              duration: 2000,
            });
          } else {
            this.snackBar.open('Checkpoint failed!', 'OK', {
              duration: 2000,
            });
          }
          this.getCheckinOfEmployeeAndPunishment();
        },
        error: (error) => {
          this.snackBar.open('Checkpoint failed!', 'OK', {
            duration: 2000,
          });
        },
      });

  }

  refresh() {
    window.location.reload();
  }
}
