import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private base_url = 'http://127.0.0.1:5000/';

  constructor(private httpClient: HttpClient) { }

  public recognizeFace(image: any): any {
    return this.httpClient
      .post<any>(this.base_url + 'recognize_face', image)
      .pipe();
  }

  public saveImage(data: any): any {
    return this.httpClient
      .post<any>(this.base_url + 'save_image', data)
      .pipe();
  }

  public getAllImageByEmployeeId(employeeId: number): any {
    const requestJson = {
      employeeId: employeeId.toString()
    };
    return this.httpClient
      .post<any>(this.base_url + 'get_images_base64', requestJson)
      .pipe();
  }

  public deleteImage(nameFile: string, employeeId: number): any {
    const requestJson = {
      employeeId: employeeId.toString(),
      nameFile: nameFile
    };
    return this.httpClient
      .post<any>(this.base_url + 'delete_image', requestJson)
      .pipe();
  }
}
