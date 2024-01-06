import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDetailDto } from 'src/app/model/project-view-detail';
import { ProjectViewManageDto } from 'src/app/model/project-view-manage-dto';
import { BaseServiceService } from '../base-service/base-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService   extends BaseServiceService{
  constructor(private httpClient: HttpClient) { super()}

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

  public saveTask(task: any): Observable<any> {
    return this.httpClient.post<any>(this.base_url + 'tasks/save_by_project', task).pipe();
  }

  public deleteTask(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id);
    return this.httpClient.delete<any>(this.base_url + 'tasks/delete', { params: params }).pipe();
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

  public saveProject(projectDetailDto: ProjectDetailDto): Observable<any> {
    return this.httpClient.post<any>(this.base_url + 'projects/save', projectDetailDto).pipe();
  }

  public deleteProject(id: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('projectId', id);
    return this.httpClient.delete<any>(this.base_url + 'projects/delete', { params: params }).pipe();
  }

  public updateTaskStatus(id: number, status: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('taskId', id);
    params = params.append('status', status);
    return this.httpClient.put<any>(this.base_url + 'tasks/update_status', null, { params: params }).pipe();
  }
}
