import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../service/auth/auth.service';
import { AuthRequest } from '../model/auth-request.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  auth : AuthRequest = new AuthRequest('', '');
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if(this.cookieService.check("TimesheetAppToken") === true) {
      this.router.navigate(["/home"]);
    }
  }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    this.auth.setUsername(this.form.controls["username"].value)
    this.auth.setPassword(this.form.controls["password"].value)
    this.authService.doLogin(this.auth).subscribe(
      (response: any) => {
        if(response === 'UNAUTHORIZED') {
          this.snackBar.open('Login failed. Please check your username and password. Or are you not registered yet', 'OK', {
            duration: 2000,
          });
          return;
        } else {
        this.cookieService.set("TimesheetAppToken", response.accessToken);
        this.cookieService.set("TimesheetAppRefreshToken", response.refreshToken);
        this.cookieService.set("TimesheetAppUsername", response.email);
        this.cookieService.set("TimesheetAppEmployeeId", response.employeeId);
        this.snackBar.open('Login successfully with employee id = ' + this.cookieService.get("TimesheetAppEmployeeId"), 'OK', {
          duration: 2000,
        }); 
        console.log(response);
        if (Number(response.employeeId) === 43) {
          this.router.navigate(["/home/my_checkin"]);
        }
        else this.router.navigate(["/home/timesheet"]);
        }
      }
    );
  }

}
