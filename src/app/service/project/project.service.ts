import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectViewManageDto } from 'src/app/model/project-view-manage-dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private base_url = 'http://localhost:8081/Timesheet/app/';
  constructor(private httpClient: HttpClient) { }

  public getAllProject(pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string, status: string, keyword: string): Observable<ProjectViewManageDto[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('status', status);
    params = params.append('nameKey', keyword);
    return this.httpClient.get<ProjectViewManageDto[]>(this.base_url + 'projects/get_all', { params: params }).pipe();
  }

  public updateStatusProject(id: number, status: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', id);
    params = params.append('status', status);
    return this.httpClient.put<any>(this.base_url + 'projects/update_status', null, { params: params }).pipe();
  }

  public getProjectDetails(id: number): Observable<ProjectViewManageDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', id);
    return this.httpClient.get<ProjectViewManageDto>(this.base_url + 'projects/get_details', { params: params }).pipe();
  }

  public getTaskDetails(pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string, id: number, keyword: string, type: string, status: string, priority: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNum', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortOrder);
    params = params.append('projectId', id);
    params = params.append('keyword', keyword);
    params = params.append('Type', type);
    params = params.append('status', status);
    params = params.append('priority', priority);

    return this.httpClient.get<any>(this.base_url + 'tasks/get_task_detail_by_project', { params: params }).pipe();
  }
}
