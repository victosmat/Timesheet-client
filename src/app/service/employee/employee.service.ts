import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDetailDto } from 'src/app/model/employee-detail-dto';
import { PmDto } from 'src/app/model/pm-dto';
import { DepartmentDto } from 'src/app/model/department-dto';
import { RoleDto } from 'src/app/model/role-dto';
import { ro } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private base_url = 'http://localhost:8081/Timesheet/app/';

  constructor(private httpClient: HttpClient) { }

  public getStaffPage(
    buddyId: number,
    pageNumber: number,
    pageSize: number,
    nameSearch: string,
    sortField: string,
    sortOrder: string
  ) {
    let params: HttpParams = new HttpParams();
    params = params.append('buddyId', buddyId);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('nameSearch', nameSearch);
    params = params.append('sortField', sortField);
    params = params.append('sortOrder', sortOrder);
    return this.httpClient
      .get(this.base_url + 'employees/view_staff', { params: params })
      .pipe();
  }

  public deactivateUser(employeeId: number, isEnable: boolean): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', employeeId);
    params = params.append('isEnable', isEnable);
    return this.httpClient
      .put<any>(this.base_url + 'employees/update_isEnable', null, { params: params })
      .pipe();
  }

  public activateUser(employeeId: number, isEnable: boolean): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', employeeId);
    params = params.append('isEnable', isEnable);
    return this.httpClient
      .put<any>(this.base_url + 'employees/update_isEnable', null, { params: params })
      .pipe();
  }

  public getAllPaySlip(pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string, keyword: string, paymentStatus: string, level: string, branch: string, month: number, year: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('keyword', keyword);
    params = params.append('paymentStatus', paymentStatus);
    params = params.append('level', level);
    params = params.append('branch', branch);
    params = params.append('month', month);
    params = params.append('year', year);
    return this.httpClient
      .get(this.base_url + 'pay_slip/view_payslip', { params: params })
      .pipe();
  }

  public deleteBonus(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .delete<any>(this.base_url + 'bonuses/delete', { params: params })
      .pipe();
  }

  public saveBonus(bonusDto: any): Observable<any> {
    console.log(bonusDto);
    return this.httpClient
      .post<any>(this.base_url + 'bonuses/save', bonusDto)
      .pipe();
  }

  public getAllBonus(keyword: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('keyword', keyword);
    return this.httpClient
      .get(this.base_url + 'bonuses/get_all', { params: params })
      .pipe();
  }

  public getBonusById(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .get<any>(this.base_url + 'bonuses/get_by_id', { params: params })
      .pipe();
  }

  public getAllCheckinAndPunishment(pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string, keyword: string, month: number, year: number, department: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('keyword', keyword);
    params = params.append('month', month);
    params = params.append('year', year);
    params = params.append('department', department);
    return this.httpClient
      .get(this.base_url + 'checkin/get_all_checkin_of_and_punishment', { params: params })
      .pipe();
  }

  public getJobDepartmentById(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .get<any>(this.base_url + 'job_departments/get_by_id', { params: params })
      .pipe();
  }

  public updatePassword(employeeId: number, oldPassword: string, newPassword: string): Observable<any> {
    const passwordRequest = {
      id: employeeId,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.httpClient
      .put<any>(this.base_url + 'employees/update_password', passwordRequest)
      .pipe();
  }


  public deleteDepartment(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .delete<any>(this.base_url + 'departments/delete', { params: params })
      .pipe();
  }

  public saveDepartment(departmentDto: any): Observable<any> {
    return this.httpClient
      .post<any>(this.base_url + 'departments/save', departmentDto)
      .pipe();
  }

  public deleteJobDepartment(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .delete<any>(this.base_url + 'job_departments/delete', { params: params })
      .pipe();
  }

  public saveJobDepartment(jobDepartmentDto: any): Observable<any> {
    return this.httpClient
      .post<any>(this.base_url + 'job_departments/save', jobDepartmentDto)
      .pipe();
  }

  public getDepartmentsById(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient
      .get<any>(this.base_url + 'departments/get_by_id', { params: params })
      .pipe();
  }

  public getJobDepartments(keyword: any): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('keyword', keyword);
    return this.httpClient
      .get<any>(this.base_url + 'job_departments/get_all', { params: params })
      .pipe();
  }

  public getRoles(): Observable<RoleDto[]> {
    return this.httpClient
      .get<RoleDto[]>(this.base_url + 'employees/get_all_role')
      .pipe();
  }

  public getPms(): Observable<PmDto[]> {
    return this.httpClient.get<PmDto[]>(this.base_url + 'employees/pms').pipe();
  }

  public getDepartments(keyword: any): Observable<DepartmentDto[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('keyword', keyword);
    return this.httpClient
      .get<DepartmentDto[]>(this.base_url + 'departments/get_all', {
        params: params,
      })
      .pipe();
  }

  public getProfile(employeeId: number): Observable<EmployeeDetailDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', employeeId);
    return this.httpClient
      .get<EmployeeDetailDto>(this.base_url + 'employees/get_by_id', {
        params: params,
      })
      .pipe();
  }

  public editRole(employeeId: number, roleIdList: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', employeeId);
    params = params.append('list_role_id', roleIdList);
    return this.httpClient
      .put<any>(this.base_url + 'employees/update_role', null, { params: params })
      .pipe();
  }

  public getEmployees(
    pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    nameSearch: string,
    isEnable: string,
    level: string,
    type: string,
    branch: string
  ) {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('keyword', nameSearch);
    params = params.append('isEnable', isEnable);
    params = params.append('level', level);
    params = params.append('type', type);
    params = params.append('branch', branch);
    return this.httpClient
      .get(this.base_url + 'employees/page', { params: params })
      .pipe();
  }
}
