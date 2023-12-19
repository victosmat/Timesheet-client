import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CheckInDto } from 'src/app/model/check-in-dto';
import { CheckInRequestDto } from 'src/app/model/check-in-request-dto';
import { CheckinPunishmentDto } from 'src/app/model/checkin-punishment-dto';
import { NoteCommentViewDto } from 'src/app/model/note-comment-view-dto';
import { NoteDetailDto } from 'src/app/model/note-detail-dto';
import { NoteFormDto } from 'src/app/model/note-form-dto';
import { NoteSummaryRequestDto } from 'src/app/model/note-summary-request-dto';
import { NotesPerDayDto } from 'src/app/model/notes-per-day-dto';
import { ProjectSelectDto } from 'src/app/model/project-select-dto';
import { PunishmentDto } from 'src/app/model/punishment-dto';
import { TaskSelectDto } from 'src/app/model/task-select-dto';
import { TimeSheetStatus } from 'src/app/my-timesheet/timesheet-dialog/timesheet-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  UpdateIsDeletedComponent(id: any) {
    throw new Error('Method not implemented.');
  }
  private base_url = 'http://localhost:8081/Timesheet/app/';

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService) { }

  public getTimesheetByWeek(
    employeeId: number,
    weekNumber: number
  ): Observable<Object> {
    let params: HttpParams = new HttpParams();
    params = params.append('employeeId', employeeId);
    params = params.append('weekNumber', weekNumber);
    return this.httpClient
      .get(this.base_url + 'notes/notes_by_week', { params: params })
      .pipe();
  }
  public getNoteCommentByNoteId(
    noteId: number
  ): Observable<NoteCommentViewDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('noteId', noteId);
    return this.httpClient
      .get(this.base_url + 'notes/note_comment_by_id', { params: params })
      .pipe();
  }

  public updateIsDeleted(punishmentId: number, isDeleted: boolean): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('checkinId', punishmentId);
    params = params.append('isDeleted', isDeleted.toString());
    return this.httpClient
      .put(this.base_url + 'punishments/update_isDeleted', null, { params: params })
      .pipe();
  }

  public updateComment(noteCommentId: number, comment: string, noteId: number, employeeId: number): Observable<any> {
    const noteCommentDto = {
      id: noteCommentId,
      comment: comment,
      noteId: noteId,
      employeeId: employeeId
    };

    console.log(noteCommentDto);

    return this.httpClient
      .post(this.base_url + 'note_comments/save', noteCommentDto)
      .pipe();
  }


  public updateTimesheetStatus(noteId: string, status: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('noteId', noteId);
    params = params.append('status', status);
    return this.httpClient
      .put(this.base_url + 'notes/update_staff_timesheet_status', null, { params: params })
      .pipe();
  }

  public saveComplain(
    checkinId: number,
    noteComplain: string
  ): Observable<PunishmentDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('checkinId', checkinId);
    params = params.append('complain', noteComplain);
    return this.httpClient
      .put<PunishmentDto>(this.base_url + 'punishments/update_complain', null, {
        params: params,
      })
      .pipe();
  }

  public saveReplyComplain(
    checkinId: number,
    noteComplain: string
  ): Observable<PunishmentDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('checkinId', checkinId);
    params = params.append('complainReply', noteComplain);
    return this.httpClient
      .put<PunishmentDto>(this.base_url + 'punishments/update_complain_reply', null, {
        params: params,
      })
      .pipe();
  }

  public getCheckinOfEmployeeAndPunishment(
    pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    employeeId: number,
    status: string,
    month: number,
    year: number,
    isComplain: Boolean | null
  ): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('employeeId', employeeId);
    params = params.append('status', status);
    params = params.append('month', month + 1);
    params = params.append('year', year),
    params = params.append('isManage', 'true');
    if (isComplain !== null) {
      params = params.append('isComplain', isComplain.toString());
    }

    return this.httpClient
      .get<CheckinPunishmentDto[]>(
        this.base_url + 'checkin/get_checkin_of_employee_and_punishment',
        { params: params }
      )
      .pipe();
  }

  public getAllNote(
    status: string | null,
    startDate: Date | null,
    endDate: Date | null,
    emailKeyword: string | null
  ): Observable<NoteDetailDto[]> {
    let params: HttpParams = new HttpParams();
    const employeeId = this.cookieService.get('TimesheetAppEmployeeId');
    params = params.append('pmId', employeeId);
    if (status !== null) {
      params = params.append('status', status);
    }
    if (startDate !== null) {
      params = params.append('startDate', startDate.toISOString());
    }
    if (endDate !== null) {
      params = params.append('endDate', endDate.toISOString());
    }
    if (emailKeyword !== null) {
      params = params.append('emailKeyword', emailKeyword);
    }
    return this.httpClient
      .get<NoteDetailDto[]>(this.base_url + 'notes/get_all_note', {
        params: params,
      })
      .pipe();
  }

  updateIsReaded(noteCommentId: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('noteCommentId', noteCommentId);
    return this.httpClient
      .get(this.base_url + 'note_comments/update_isReaded', { params: params })
      .pipe();
  }

  public getListProjectForTimesheetForm(
    employeeId: number
  ): Observable<ProjectSelectDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('employeeId', employeeId);
    return this.httpClient
      .get(this.base_url + 'notes/project_for_form', { params: params })
      .pipe();
  }

  public getListTaskForSelectedProject(
    projectId: number
  ): Observable<TaskSelectDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', projectId);
    return this.httpClient
      .get(this.base_url + 'notes/task_for_form', { params: params })
      .pipe();
  }

  public getTimesheetById(noteId: number): Observable<NoteFormDto> {
    console.log(noteId);
    let params: HttpParams = new HttpParams();
    params = params.append('noteId', noteId);
    return this.httpClient
      .get(this.base_url + 'notes/note_by_id', { params: params })
      .pipe();
  }

  public saveTimesheet(noteFormDto: NoteFormDto): Observable<any> {
    return this.httpClient
      .post(this.base_url + 'notes/save', noteFormDto)
      .pipe();
  }

  public getEmployeeId(): Observable<any> {
    return this.httpClient.get(this.base_url + 'employees/employee_id').pipe();
  }

  public deleteTimesheet(noteId: number): Observable<any> {
    console.log(noteId);
    let params: HttpParams = new HttpParams();
    params = params.append('noteId', noteId);
    return this.httpClient
      .get(this.base_url + 'notes/delete', { params: params })
      .pipe();
  }

  public submitWeekForApproved(weekNumber: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('currentWeekNumber', weekNumber);
    return this.httpClient
      .get(this.base_url + 'notes/submit_week_for_approved', { params: params })
      .pipe();
  }

  public getNoteSummaryPerMonth(
    request: NoteSummaryRequestDto
  ): Observable<any> {
    return this.httpClient
      .post(this.base_url + 'notes/note_summary', request)
      .pipe();
  }

  public getCheckInSummaryPerMonth(
    request: CheckInRequestDto
  ): Observable<any> {
    return this.httpClient
      .post(this.base_url + 'checkin/checkin_per_month', request)
      .pipe();
  }

  public getNumberOfEmployeeOpenTalks(
    request: CheckInRequestDto
  ): Observable<any> {
    return this.httpClient
      .post(this.base_url + 'notes/open_talk_count', request)
      .pipe();
  }

  public saveCheckpointTime(employeeId: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('employeeId', employeeId);
    params = params.append('checkPointTime', new Date().toISOString());
    return this.httpClient
      .get(this.base_url + 'checkin/save_checkpoint_time', { params: params })
      .pipe();
  }

  public getStaffTimesheetByTime(
    staffId: number,
    month: number,
    year: number
  ): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('staffId', staffId);
    params = params.append('month', month + 1);
    params = params.append('year', year);
    return this.httpClient
      .get(this.base_url + 'notes/staff_timesheet_by_month', { params: params })
      .pipe();
  }

  public updateStaffTimesheetStatus(noteId: number, status: TimeSheetStatus) {
    console.log(noteId);
    let params: HttpParams = new HttpParams();
    params = params.append('noteId', noteId);
    params = params.append('status', status);
    return this.httpClient
      .put(this.base_url + 'notes/update_staff_timesheet_status', null, {
        params: params,
      })
      .pipe();
  }
}
