import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the Authorization header
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.authService.accessToken}`)
        });

        // Handle the request
        return next.handle(authReq).pipe(
            catchError(error => {
                if (error.status === 401) {
                    // Handle token refresh
                    return this.authService.refreshAccessToken().pipe(
                        switchMap(() => {
                            // Retry the failed request with the new token
                            const newAuthReq = req.clone({
                                headers: req.headers.set('Authorization', `Bearer ${this.authService.accessToken}`)
                            });
                            return next.handle(newAuthReq);
                        }),
                        catchError(refreshError => {
                            // If token refresh fails, log out the user
                            this.authService.signOut().subscribe(() => {
                                // Optional: You might want to redirect to login here as well
                            });
                            return throwError(refreshError);
                        })
                    );
                }

                return throwError(error);
            })
        );
    }
}