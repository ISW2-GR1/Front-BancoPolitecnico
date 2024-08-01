import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    private baseUrl = environment.apiUrl;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for refresh token
     */
    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}forgot-password`, {
            email,
        });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}reset-password`, {
            password,
        });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post<any>(`${this.baseUrl}login/`, credentials)
            .pipe(
                switchMap((response: any) => {
                    console.log('Response from server:', response);

                    if (response && response.access && response.refresh) {
                        this.accessToken = response.access;
                        localStorage.setItem('refreshToken', response.refresh);
                        this._authenticated = true;
                        this._userService.user = response.user;
                        return of(response);
                    } else {
                        return throwError(
                            'Invalid response format: ' +
                                JSON.stringify(response)
                        );
                    }
                }),
                catchError((error) => {
                    console.error('Error during login:', error);
                    return throwError(error);
                })
            );
    }

    /**
     * Sign in using the access token
     */

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this._authenticated = false;
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
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

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post(
            `${this.baseUrl}unlock-session`,
            credentials
        );
    }

    /**
     * Check the authentication status
     */

    // check(): Observable<boolean> {
    //     if (this._authenticated) {
    //         return of(true);
    //     }

    //     const token = this.accessToken;
    //     if (!token) {
    //         return of(false);
    //     }
    //     return this._httpClient.post<{ valid: boolean }>(`${this.baseUrl}verify-token`, { token }).pipe(
    //         map(response => {
    //             if (response.valid) {
    //                 this._authenticated = true;
    //                 return true;
    //             } else {
    //                 this._authenticated = false;
    //                 return false;
    //             }
    //         }),
    //         catchError(error => {
    //             console.error('Error during token verification:', error);
    //             this._authenticated = false;
    //             return of(false);
    //         })
    //     );
    // }

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
        return this._httpClient.post(`${this.baseUrl}email-confirm/`, {
            token,
        });
    }
}
