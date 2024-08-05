import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  private baseUrl = environment.apiUrl;
  private _authService = inject(AuthService);

  constructor(
    private http: HttpClient
  ) { }


  //Create a new bank account
  createBankAccount(data: any) {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl}create-bank-account/`, data, { headers }).pipe;
  }
}
