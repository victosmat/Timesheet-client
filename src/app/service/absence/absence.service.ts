import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbsenceDto, AbsenceStatus } from 'src/app/model/absence-dto';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private base_url = "http://localhost:8081/Timesheet/app/";

  constructor(
    private httpClient: HttpClient
  ) { }

  public listAllAbsenceRequestInMonthAndYearOfEmployee(month : number, year : number, employeeId : number) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("month", month);
    params = params.append("year", year);
    params = params.append("employeeId", employeeId);
    return this.httpClient.get(this.base_url + "absence/get_absence_of_month", {params : params}).pipe();
  }

  public findAllByAbsenceTypeName(absenceTypeName : string) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("absenceTypeName", absenceTypeName);
    return this.httpClient.get(this.base_url + "absenceTypeOff/get_absence_type_off_select", { params : params }).pipe();
  }

  public listAllAbsenceRequestInThisDate(date: Date, email: string, status: string, type: string) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("date", date.toISOString());
    params = params.append("email", email);
    params = params.append("status", status);
    params = params.append("type", type);
    return this.httpClient.get(this.base_url + "absence/get_absences_all_per_day", { params : params });
  }

  getAllAbsenceDaysListOfParticularMonth(monthNumber : number, year : number, email : string, status : string, type : string) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("month", monthNumber + 1);
    params = params.append("year", year);
    params = params.append("email", email);
    params = params.append("status", status);
    params = params.append("type", type);
    return this.httpClient.get(this.base_url + "absence/get_day_absence_list_all", { params : params }).pipe();
  }

  public saveAbsenceRequest(absenceRequest : AbsenceDto) : Observable<any> {
    return this.httpClient.post(this.base_url + "absence/save", absenceRequest).pipe();
  }

  public getAbsenceDaysListOfParticularMonth(monthNumber : number, year : number, employeeId : number) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("month", monthNumber + 1);
    params = params.append("year", year);
    params = params.append("employeeId", employeeId);
    return this.httpClient.get(this.base_url + "absence/get_day_absence_list", { params : params });
  }

  listAllAbsenceRequestInThisDateOfEmployee(date: Date, employeeId: number) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("date", date.toISOString());
    params = params.append("employeeId", employeeId);
    return this.httpClient.get(this.base_url + "absence/get_absences_per_day", { params : params });
  }

  findAbsenceRequestById(id : number) {
    let params : HttpParams = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.get(this.base_url + "absence/find_by_id", { params : params }).pipe();
  }

  deleteAbsenceRequestById(id : number) {
    let params : HttpParams = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.delete(this.base_url + "absence/delete_by_id", { params : params }).pipe();
  }

  getStaffAbsenceByTime(id: any, month: number, year: number) : Observable<any> {
    let params : HttpParams = new HttpParams();
    params = params.append("staffId", id);
    params = params.append("month", month + 1);
    params = params.append("year", year);
    return this.httpClient.get(this.base_url + "absence/staff_absence_by_month", { params : params }).pipe();
  }

  public updateStaffAbsenceStatus(absenceId : number, status : AbsenceStatus) {
    console.log(absenceId);
    let params : HttpParams = new HttpParams();
    params = params.append("absenceId", absenceId);
    params = params.append("status", status);
    return this.httpClient.put(this.base_url + "absence/update_staff_absence_status", null, {params : params}).pipe();
  }

}
