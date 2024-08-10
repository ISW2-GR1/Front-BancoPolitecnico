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
    set user(value: any) { 
        this._user.next(value);
    }

    get user$(): Observable<any> { 
        return this._user.asObservable();
    }

    get(): Observable<any> {
        const token = this._authService.accessToken;

        if (!token) {
            throw new Error('Access token is not available');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this._httpClient.get<any>(`${this.baseUrl}profile/`, { headers }).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    //Api para actualizar el perfil, unicamente el username
    updateProfile(username: string): Observable<any> {
        const token = this._authService.accessToken;

        if (!token) {
            throw new Error('Access token is not available');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this._httpClient.patch<any>(`${this.baseUrl}profile/`, { username }, { headers }).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    //Api para actualizar la contraseña del usuario autenticado update-password/
    updatePassword(old_password: string, new_password: string): Observable<any> {
        const token = this._authService.accessToken;

        if (!token) {
            throw new Error('Access token is not available');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this._httpClient.patch<any>(`${this.baseUrl}profile/update-password/`, { old_password, new_password }, { headers });
    }
}