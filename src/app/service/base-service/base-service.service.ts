import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService {
  public base_url = 'https://special-barely-macaque.ngrok-free.app/Timesheet/app/';
  // public base_url = 'http://localhost:8081/Timesheet/app/';
  constructor() { }
}
