import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from '../service/employee/employee.service';
import { AuthService } from '../service/auth/auth.service';
import { CheckinService } from '../service/checkin/checkin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  fullname!: string;
  email!: string;
  roles: string[] = [];
  image : any;
  employeeId = Number(this.cookieService.get('TimesheetAppEmployeeId'));

  constructor(
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    public authService: AuthService,
    private checkinService: CheckinService,
    private router: Router) { }

  ngOnInit(): void {

    if (Number(this.employeeId) !== 43) {
      this.checkinService.getAvatar(Number(this.employeeId)).subscribe({
        next: (response: any) => {
          console.log(response);
          this.image = response.imageBase64;
        },
        error: (error: any) => {
          console.log(error.status);
        },
        complete: () => { },
      });}

    this.employeeService.getProfile(Number(this.employeeId)).subscribe({
      next: (response: any) => {
        this.fullname = response.lastName + " " + response.firstName;
        this.email = response.email;
      },
      error: (error: any) => {
        console.log(error.status);
      },
      complete: () => { },
    });
  }

  getTimesheetToken() {
    return this.cookieService.get('TimesheetAppToken');
  }

  logout() {
    this.cookieService.delete('TimesheetAppToken');
    this.cookieService.delete('TimesheetAppRefreshToken');
    this.cookieService.delete('TimesheetAppUsername');
    this.cookieService.delete('TimesheetAppEmployeeId');
    this.router.navigate(['login']);
  }
}
