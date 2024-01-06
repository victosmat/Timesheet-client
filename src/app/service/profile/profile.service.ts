import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BaseServiceService } from '../base-service/base-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseServiceService {


  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { super(); }

  getProfile() {
    let params: HttpParams = new HttpParams();
    params = params.append("id", Number(this.cookieService.get("TimesheetAppEmployeeId")));
    return this.httpClient.get(this.base_url + "profile", { params: params });
  }
}
