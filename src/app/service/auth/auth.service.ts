import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from "jwt-decode";
import { AuthRequest } from 'src/app/model/auth-request.model';
import { RefreshTokenDto } from 'src/app/model/refresh-token-dto.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_url = "http://localhost:8081/Timesheet/app/";

  loginHeader = new HttpHeaders(
    {"No-Auth": "True"}
  );

  constructor(
    private cookieService : CookieService,
    private httpClient : HttpClient
  ) { }

  public roleMatch(allowedRoles : string[]) : boolean {
    const userRoles = this.getRoles();
    if(userRoles !== null && userRoles.length > 0) {
      return userRoles.some(element => allowedRoles.includes(element));
    }
    return false;
  }

  public getRoles() {
    let roles : string | any = this.getToken().roles;
    roles = roles.replace("[", "");
    roles = roles.replace("]", "");
    roles = roles.replaceAll(" ", "");
    let rolesArray: Array<string> = roles.split(",");
    return rolesArray;
  }

  public getToken() : string | any {
    return jwt_decode(this.cookieService.get("TimesheetAppToken"));
  }

  public getOriginalToken() {
    return this.cookieService.get("TimesheetAppToken");
  }

  public getOriginalRefreshToken() {
    return this.cookieService.get("TimesheetAppRefreshToken");
  }

  public doLogin(auth: AuthRequest) {
    return this.httpClient.post(this.base_url + "login", auth, { headers: this.loginHeader })
  }

  refreshToken(refreshTokenBody: RefreshTokenDto) {
    console.log("Jump into refreshToken")
    return this.httpClient.post(this.base_url + "refresh_token", refreshTokenBody, { headers: this.loginHeader })
  }

  signOut() {
    this.cookieService.deleteAll();
  }

}
