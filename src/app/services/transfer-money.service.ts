import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferMoneyService {
  private baseUrl = environment.apiUrl;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) { }

  // Create a new transfer
  createTransfer(data: any): Observable<any> {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._httpClient.post<any>(`${this.baseUrl}transfer-money/`, data, { headers });
  }

  // Confirm the transfer
  confirmTransfer(data: any): Observable<any> {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._httpClient.post<any>(`${this.baseUrl}confirm-transfer/`, data, { headers });
  }

  //Resumen de transferencias enviadas y recibidas transfer-summary/
  transferSummary(): Observable<any> {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._httpClient.get<any>(`${this.baseUrl}transfer-summary/`, { headers })
      .pipe(
        map(transactions => transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
      );
  }

  //Buscar contácto
  searchContact(data: any): Observable<any> {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._httpClient.post<any>(`${this.baseUrl}search/bank-accounts/`, data, { headers });
  }

  //Añadir contácto 
  addContact(data: any): Observable<any> {
    const token = this._authService.accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._httpClient.post<any>(`${this.baseUrl}contacts/add/`, data, { headers });
  }

}