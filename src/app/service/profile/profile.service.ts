import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private base_url = "http://localhost:8081/Timesheet/app/";

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }

  getProfile() {
    let params: HttpParams = new HttpParams();
    params = params.append("id", Number(this.cookieService.get("TimesheetAppEmployeeId")));
    return this.httpClient.get(this.base_url + "profile", {params : params});
  }
}
