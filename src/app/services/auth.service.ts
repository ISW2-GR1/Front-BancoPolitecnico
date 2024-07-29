import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public signIn(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, credentials);
  }

  public register(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, data);
  }

  public getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}profile/`);
  }
}
