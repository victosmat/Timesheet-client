import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseServiceService } from '../base-service/base-service.service';

@Injectable({
  providedIn: 'root'
})
export class CheckinService extends BaseServiceService {

  constructor(private httpClient: HttpClient) { 
    super();
  }

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

  public registerImages(employeeId: number, images: any): any {
    const requestJson = {
      employeeId: employeeId.toString(),
      images: images
    };
    return this.httpClient
      .post<any>(this.base_url + 'save_list_images', requestJson)
      .pipe();
  }
}
