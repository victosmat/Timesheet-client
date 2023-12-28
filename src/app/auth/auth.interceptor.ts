import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RefreshTokenDto } from '../model/refresh-token-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.get("No-Auth") === "True") {
      return next.handle(request.clone());
    }
    const token = "Bearer " + this.authService.getOriginalToken();
    const headers = new HttpHeaders().set('Authorization', token);
    const AuthRequest = request.clone({ headers: headers });
    return next.handle(AuthRequest).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.handle401ErrorHappenedByToken(request, next);
          } else if (err.status === 403) {
            this.snackBar.open("Error! An error occurred. Please try again later", "OK", {
              duration: 2000,
            });
          } else if (err.status === 404) {
            this.router.navigate(['/**'])
          } else if (err.status === 405) {

          } else if (err.status === 500) {

          } else {

          }
          return throwError(() => err);
        }
      )
    )
  }

  private handle401ErrorHappenedByToken(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      //lam moi
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getOriginalRefreshToken();
      if (refreshToken) {
        return this.authService.refreshToken(new RefreshTokenDto(refreshToken)).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.cookieService.set("TimesheetAppToken", response.accessToken);
            this.cookieService.set("TimesheetAppRefreshToken", response.refreshToken);
            this.cookieService.set("TimesheetAppUsername", response.username);
            this.cookieService.set("TimesheetAppEmployeeId", response.employeeId);
            this.refreshTokenSubject.next(response.accessToken);
            return next.handle(this.addTokenHeader(request, response.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.signOut();
            return throwError(() => err);
          })
        );
      }
    }
    return this.refreshTokenSubject.pipe(
      filter(refreshToken => refreshToken !== null),
      take(1),
      switchMap((refreshToken) => next.handle(this.addTokenHeader(request, refreshToken)))
    );

  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    return request.clone({ headers: request.headers.set("Authorization", 'Bearer ' + token) });

    /* for Node.js Express back-end */
    // return request.clone({ headers: request.headers.set("Authorization", token) });
  }
}
