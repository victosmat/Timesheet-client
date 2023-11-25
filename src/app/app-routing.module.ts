import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTimesheetComponent } from './my-timesheet/my-timesheet.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyAbsenceDayComponent } from './my-absence-day/my-absence-day.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ManageAbsenceComponent } from './manage-home/manage-absence/manage-absence.component';
import { ManageHomeComponent } from './manage-home/manage-home.component';
import { ManagementTimesheetComponent } from './management-timesheet/management-timesheet.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ManagementUserComponent } from './management-user/management-user.component';
import { ManagementProjectComponent } from './management-project/management-project.component';
import { ManagementDepartmentComponent } from './management-department/management-department.component';
import { ManagementJobDepartmentComponent } from './management-job-department/management-job-department.component';
import { ManagementAbsenceComponent } from './management-absence/management-absence.component';
import { ManagementTardinessComponent } from './management-tardiness/management-tardiness.component';
import { ManagementBonusComponent } from './management-bonus/management-bonus.component';
import { ManagementMonitoringComponent } from './management-monitoring/management-monitoring.component';

const routes: Routes = [
  { path: '', redirectTo: "/login", pathMatch: "full"},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,
    children : [
      { path: 'timesheet', component: MyTimesheetComponent, canActivate: [AuthGuard], data: { roles: ["STAFF, INTERN"] }, },
      { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard], data: { roles: ["STAFF, INTERN"] }, },
      { path: 'absence', component: MyAbsenceDayComponent, canActivate: [AuthGuard], data: { roles: ["STAFF, INTERN"] }, },
      { path: 'admin_user', component: ManagementUserComponent, canActivate: [AuthGuard], data: { roles: ["PM"] }, },
      { path: 'admin_project', component: ManagementProjectComponent, canActivate: [AuthGuard], data: { roles: ["PM"] }, },
      { path: 'admin_department', component: ManagementDepartmentComponent, canActivate: [AuthGuard], data: { roles: ["PM"] }, },
      { path: 'admin_job_department', component: ManagementJobDepartmentComponent, canActivate: [AuthGuard], data: { roles: ["PM"] }, },
      { path: 'manage_timesheet', component: ManagementTimesheetComponent, canActivate: [AuthGuard], data: { roles: ["PM, HR"] }, },
      { path: 'manage_monitoring', component: ManagementMonitoringComponent, canActivate: [AuthGuard], data: { roles: ["PM, HR"] }, },
      { path: 'manage_absence', component: ManagementAbsenceComponent, canActivate: [AuthGuard], data: { roles: ["PM, HR"] }, },
      { path: 'manage_Tardiness', component: ManagementTardinessComponent, canActivate: [AuthGuard], data: { roles: ["PM, HR"] }, },
      { path: 'admin_bonus', component: ManagementBonusComponent, canActivate: [AuthGuard], data: { roles: ["PM"] }, },
    ]
  },
  { path: 'forbidden', component: ForbiddenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
