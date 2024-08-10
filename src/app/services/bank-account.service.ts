import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BankAccountService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private _authService: AuthService) {}

    // Verificar la cédula para enviar el código de verificación
    verifyIdentity(cedula: string): Observable<any> {
        const token = this._authService.accessToken;
        if (!token) {
            throw new Error('Access token is not available');
        }
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    
        return this.http.post<any>(
            `${this.baseUrl}verify-cedula-and-send-code/`,
            { cedula },
            { headers }
        );
    }
    

    //verificar el codigo de verificacion enviado al correo del usuario autenticado
    verifyCode(verificationCode: string): Observable<any> {
        const token = this._authService.accessToken;
        if (!token) {
            throw new Error('Access token is not available');
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this.http.post<any>(
            `${this.baseUrl}verify-code-and-create-account/`,
            { verification_code: verificationCode },
            { headers }
        );
    }


    //Verificar cedula es ecuatoriana o si ya existe en la base de datos, no necesita estar autenticado
    verifyCedula(cedula: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}verify-cedula/`, { cedula });
    }
}
