import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { BehaviorSubject, Observable, Subject, map, of, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewEventTimesChangedEvent,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NgIf } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { AbsenceDialogComponent } from './absence-dialog/absence-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  AbsenceFormDialogComponent,
  TypeTimeOff,
} from './absence-form-dialog/absence-form-dialog.component';
import { AbsenceService } from '../service/absence/absence.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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

@Component({
  selector: 'app-my-absence-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-absence-day.component.html',
  styleUrls: ['./my-absence-day.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class MyAbsenceDayComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  currentMonth = this.viewDate.getMonth();

  events$: Observable<CalendarEvent<any>[]> = new Observable<
    CalendarEvent<any>[]
  >();

  refresh = new BehaviorSubject<boolean>(false);

  constructor(
    private dialog: MatDialog,
    private cookieService: CookieService,
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const date = this.viewDate;
    this.getAbsenceDaysListOfParticularMonth(date);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (events === undefined || events.length === 0) {
      this.snackBar.open("You can't request absence on this day", 'Close', {
        duration: 2000,
      });
      return;
    }

    const dialogRef = this.dialog.open(AbsenceDialogComponent, {
      data: {
        employeeId: this.cookieService.get('TimesheetAppEmployeeId'),
        date: date,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (response) => {
        this.getAbsenceDaysListOfParticularMonth(this.viewDate);
        this.refresh.next(true);
      },
    });
  }

  getAbsenceDaysListOfParticularMonth(date: Date) {
    this.events$ = this.absenceService
      .getAbsenceDaysListOfParticularMonth(
        date.getMonth(),
        date.getFullYear(),
        Number(this.cookieService.get('TimesheetAppEmployeeId'))
      )
      .pipe(
        tap((response: any) => {
          if (response.length === 0) {
            this.snackBar.open('No data', 'Close', {
              duration: 2000,
              panelClass: ['error-snackbar'],
            });
            return;
          }
          console.log('Response:', response)
        }),
        map((results: number[][]) => {
          return results.map((dayArray: number[]) => {
            return {
              title: 'Absence Request',
              start: new Date(dayArray[0], dayArray[1] - 1, dayArray[2]),
            };
          });
        })
      );
  }

  updateCalendar(date: any) {
    this.viewDate = date;
    if (this.viewDate.getMonth() !== this.currentMonth) {
      this.currentMonth = this.viewDate.getMonth();
      this.getAbsenceDaysListOfParticularMonth(this.viewDate);
    }
  }

  openAbsenceForm(type: string) {
    console.log(type);
    let typeTimeOff = null;
    if (type === 'WENT_SOON') {
      typeTimeOff = 'WENT_SOON';
    }
    if (type === 'COME_LATE') {
      typeTimeOff = 'COME_LATE';
    }

    const dialogRef = this.dialog.open(AbsenceFormDialogComponent, {
      data: {
        employeeId: this.cookieService.get('TimesheetAppEmployeeId'),
        type: type,
        typeTimeOff: typeTimeOff,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (response) => {
        const date = response as Date;
        if (date !== undefined) {
          this.viewDate = date;
          this.currentMonth = this.viewDate.getMonth();
          this.events$ = this.absenceService
            .getAbsenceDaysListOfParticularMonth(
              response.getMonth(),
              response.getFullYear(),
              Number(this.cookieService.get('TimesheetAppEmployeeId'))
            )
            .pipe(
              tap((response: any) => {
                if (response.length === 0) {
                  this.snackBar.open('No data', 'Close', {
                    duration: 2000,
                    panelClass: ['error-snackbar'],
                  });
                  return;
                }
                console.log('Response:', response)
              }),
              map((results: number[][]) => {
                return results.map((dayArray: number[]) => {
                  return {
                    title: 'Absence Request',
                    start: new Date(dayArray[0], dayArray[1] - 1, dayArray[2]),
                  };
                });
              })
            );
          this.refresh.next(true);
        } else {
          this.refresh.next(true);
        }
      },
    });
  }
}
