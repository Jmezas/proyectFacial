import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result';
@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}`;
  }
  updateFile(file: any) {
    return this.http.post(`${this.baseUrl}Seguridad/LoginCamara`, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  compareFace(file: any) {
    return this.http.post<Result>(
      `${this.baseUrl}Seguridad/LoginCompare`,
      file,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
