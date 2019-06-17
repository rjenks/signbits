import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  constructor(private http: HttpClient) { }

  getConfig(id: String) {
    return this.http.get('https://animefest.org/api/v1/kiosk_config?uuid=' + id);
  }
}
