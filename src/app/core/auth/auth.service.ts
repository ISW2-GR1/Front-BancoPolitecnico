import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    private baseUrl = environment.apiUrl; // Asegúrate de que esta URL esté definida correctamente

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
        return this._httpClient.post(`${this.baseUrl}forgot-password`, { email });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}reset-password`, { password });
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
    
        return this._httpClient.post<any>(`${this.baseUrl}login/`, credentials).pipe(
            switchMap((response: any) => {
                console.log('Response from server:', response); // Verifica la estructura de la respuesta
    
                // Check if the response contains both tokens
                if (response && response.access && response.refresh) {
                    // Store the tokens in local storage
                    this.accessToken = response.access;
                    localStorage.setItem('refreshToken', response.refresh);
    
                    // Set the authenticated flag to true
                    this._authenticated = true;
    
                    // Store the user on the user service (as per your original service, adjust if needed)
                    this._userService.user = response.user;
    
                    // Return a new observable with the response
                    return of(response);
                } else {
                    // Handle invalid response format
                    return throwError('Invalid response format: ' + JSON.stringify(response));
                }
            }),
            catchError(error => {
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
        // Remove the access token and refresh token from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; username: string, last_name: string, cedula: string}): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}register/`, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}unlock-session`, credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

    }
}