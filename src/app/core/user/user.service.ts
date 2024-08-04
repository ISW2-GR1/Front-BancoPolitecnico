import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<any> = new ReplaySubject<any>(1); // Cambiado a any
    private baseUrl = environment.apiUrl;
    private _authService = inject(AuthService);

    // Setter & getter for user
    set user(value: any) { // Cambiado a any
        this._user.next(value);
    }

    get user$(): Observable<any> { // Cambiado a any
        return this._user.asObservable();
    }

    // Get the current signed-in user data
    get(): Observable<any> { // Cambiado a any
        const token = this._authService.accessToken;

        if (!token) {
            throw new Error('Access token is not available');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this._httpClient.get<any>(`${this.baseUrl}profile/`, { headers }).pipe( // Cambiado a any
            tap((user) => {
                this._user.next(user);
            })
        );
    }
}