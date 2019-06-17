import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getNow() {
    return this.http.get('https://animefest.org/api/v1/now?time=2017-08-18%2020:00:00');
  }

}
