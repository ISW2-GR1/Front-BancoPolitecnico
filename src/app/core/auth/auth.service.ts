import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError, interval } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _injector = inject(Injector);

    private baseUrl = environment.apiUrl;

    constructor() {
        // Verificar el token en intervalos regulares (ej. cada 1 minuto para pruebas)
        interval(60000).subscribe(() => {
            this.checkTokenValidity().subscribe();
        });
    }

    private get _userService(): UserService {
        return this._injector.get(UserService);
    }

    // Accessors for tokens

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    // Public methods

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}forgot-password`, { email });
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}reset-password`, { password });
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<any>(`${this.baseUrl}login/`, credentials).pipe(
            switchMap((response: any) => {
                if (response && response.access && response.refresh) {
                    this.accessToken = response.access;
                    this.refreshToken = response.refresh;
                    this._authenticated = true;
                    this._userService.user = response.user;
                    return of(response);
                } else {
                    return throwError('Invalid response format: ' + JSON.stringify(response));
                }
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._authenticated = false;
        return of(true);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        username: string;
        last_name: string;
        cedula: string;
    }): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}register/`, user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (this.accessToken) {
            return of(true);
        }
        return of(false);
    }

    confirmEmail(token: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}email-confirm/`, { token });
    }

    // Private methods

    private checkTokenValidity(): Observable<boolean> {
        const refreshToken = this.refreshToken;
        if (!refreshToken) {
            this.signOut();
            return of(false);
        }

        return this._httpClient.post<any>(`${this.baseUrl}token/refresh/`, { refresh: refreshToken }).pipe(
            switchMap(response => {
                if (response && response.access) {
                    this.accessToken = response.access;
                    return of(true);
                } else {
                    this.signOut();
                    return of(false);
                }
            }),
            catchError((error) => {
                this.signOut();
                return of(false);
            })
        );
    }
}