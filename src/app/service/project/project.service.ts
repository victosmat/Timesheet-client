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

  public getAllProject(status: string, keyword: string) : Observable<ProjectViewManageDto[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('status', status);
    params = params.append('nameKey', keyword);
    return this.httpClient.get<ProjectViewManageDto[]>(this.base_url + 'projects/get_all', { params: params }).pipe();
  }

  public getProjectDetails(id: number) : Observable<ProjectViewManageDto> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', id);
    return this.httpClient.get<ProjectViewManageDto>(this.base_url + 'projects/get_details', { params: params }).pipe();
  }

  public getTaskDetails(id: number, keyword: string, type: string, status: string, priority: string) : Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', id);
    params = params.append('keyword', keyword);
    params = params.append('Type', type);
    params = params.append('status', status);
    params = params.append('priority', priority);
  
    return this.httpClient.get<any>(this.base_url + 'tasks/get_task_detail_by_project', { params: params }).pipe();
  }
}