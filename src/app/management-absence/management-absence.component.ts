import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgModule,
} from '@angular/core';
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
import { CookieService } from 'ngx-cookie-service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { AbsenceService } from '../service/absence/absence.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Form, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { ManagementAbsenceDialogComponent } from './management-absence-dialog/management-absence-dialog.component';
import { da } from 'date-fns/locale';

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
  selector: 'app-management-absence',
  templateUrl: './management-absence.component.html',
  styleUrls: ['./management-absence.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ManagementAbsenceComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  absenceForm!: FormGroup;

  viewDate: Date = new Date();
  searchText: string = '';
  dayAbsentStatusList: string[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
  dayAbsentTypeList: string[] = ['ALL', 'MORNING', 'AFTERNOON', 'FULL_DAY', 'COME_LATE', 'WENT_SOON'];

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
    this.absenceForm = new FormGroup({
      status: new FormControl('ALL'),
      absentDayType: new FormControl('ALL'),
      searchText: new FormControl(''),
    });
    const date = this.viewDate;
    const email = this.absenceForm.value.searchText;
    const status = this.absenceForm.value.status;
    const type = this.absenceForm.value.absentDayType;
    this.getAbsenceDaysListOfParticularMonth(
      date,
      email,
      status === 'ALL' ? '' : status,
      type === 'ALL' ? '' : type
    );
  }

  refreshData() {
    const date = this.viewDate;
    const email = this.absenceForm.value.searchText;
    const status = this.absenceForm.value.status;
    const type = this.absenceForm.value.absentDayType;
    this.getAbsenceDaysListOfParticularMonth(
      date,
      email,
      status === 'ALL' ? '' : status,
      type === 'ALL' ? '' : type
    );
  }
  onchangeStatus() {
    const date = this.viewDate;
    const email = this.absenceForm.value.searchText;
    const status = this.absenceForm.value.status;
    const type = this.absenceForm.value.absentDayType;
    this.getAbsenceDaysListOfParticularMonth(
      date,
      email,
      status === 'ALL' ? '' : status,
      type === 'ALL' ? '' : type
    );
  }

  onchangeType() {
    const date = this.viewDate;
    const email = this.absenceForm.value.searchText;
    const status = this.absenceForm.value.status;
    const type = this.absenceForm.value.absentDayType;
    this.getAbsenceDaysListOfParticularMonth(
      date,
      email,
      status === 'ALL' ? '' : status,
      type === 'ALL' ? '' : type
    );
  }

  getAbsenceDaysListOfParticularMonth(
    date: Date,
    email: string,
    status: string,
    type: string
  ) {
    this.events$ = this.absenceService
      .getAllAbsenceDaysListOfParticularMonth(
        date.getMonth(),
        date.getFullYear(),
        email,
        status,
        type
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
      const email = this.absenceForm.value.searchText;
      const status = this.absenceForm.value.status;
      const type = this.absenceForm.value.absentDayType;
      this.getAbsenceDaysListOfParticularMonth(
        this.viewDate,
        email,
        status === 'ALL' ? '' : status,
        type === 'ALL' ? '' : type
      );
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (events === undefined || events.length === 0) {
      this.snackBar.open("You can't request absence on this day", 'Close', {
        duration: 2000,
      });
      return;
    }

    const dialogRef = this.dialog.open(ManagementAbsenceDialogComponent, {
      data: {
        date: date,
        email: this.absenceForm.value.searchText,
        status: this.absenceForm.value.status,
        type: this.absenceForm.value.absentDayType,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (response) => {
        const date = this.viewDate;
        const email = this.absenceForm.value.searchText;
        const status = this.absenceForm.value.status;
        const type = this.absenceForm.value.absentDayType;
        this.getAbsenceDaysListOfParticularMonth(
          this.viewDate,
          email,
          status === 'ALL' ? '' : status,
          type === 'ALL' ? '' : type
        );
        this.refresh.next(true);
      },
    });
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
  }
}
