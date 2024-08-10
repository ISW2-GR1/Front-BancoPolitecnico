import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { BankAccountService } from 'app/services/bank-account.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
    ],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    backendErrors: any = {};
    passwordVisible: boolean = false;
    cedulaVerified: boolean = false;

    errorMessages: { [key: string]: string } = {
        'user with this cedula already exists.': 'El usuario con esta cédula ya existe.',
        'user with this email already exists.': 'El usuario con este correo electrónico ya existe.',
        'Password must be at least 8 characters long.': 'La contraseña debe tener al menos 8 caracteres.',
        'user with this username already exists.': 'El usuario con este nombre de usuario ya existe.',
        'Password must contain at least one uppercase letter.': 'La contraseña debe contener al menos una letra mayúscula.',
        'Password must contain at least one number.': 'La contraseña debe contener al menos un número.',
    };

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _bankAccountService: BankAccountService,
        private fb: FormBuilder
    ) {}

    /**
     * En inicialización
     */
    ngOnInit(): void {
        this.signUpForm = this.fb.group({
            cedula: ['', Validators.required],
            name: [{value: '', disabled: true}, Validators.required],
            last_name: [{value: '', disabled: true}, Validators.required],
            email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
            password: [{value: '', disabled: true}, [Validators.required, Validators.minLength(8)]],
            username: [{value: '', disabled: true}, Validators.required],
            phone: [{value: '', disabled: true}, Validators.required],
            address: [{value: '', disabled: true}, Validators.required],
            city: [{value: '', disabled: true}, Validators.required],
            country: [{value: '', disabled: true}, Validators.required],
            agreements: [false, Validators.requiredTrue],
        });
    }

    /**
     * Verificar la cédula
     */
    verifyCedula(): void {
        const cedula = this.signUpForm.get('cedula')?.value;
        if (!cedula) return;

        this._bankAccountService.verifyCedula(cedula).subscribe(
            (response) => {
                this.alert = {
                    type: 'success',
                    message: 'Cédula válida y pertenece a la ciudadanía Ecuatoriana.',
                };
                this.showAlert = true;
                this.cedulaVerified = true;
                this.enableFormFields();
            },
            (error) => {
                this.alert = {
                    type: 'error',
                    message: 'La cédula no es válida o ya se encuentra registrada en el sistema.',
                };
                this.showAlert = true;
                this.signUpForm
                    .get('cedula')
                    ?.setErrors({ invalidCedula: true });
            }
        );
    }

    /**
     * Habilitar campos del formulario
     */
    enableFormFields(): void {
        Object.keys(this.signUpForm.controls).forEach(field => {
            this.signUpForm.get(field)?.enable();
        });
        this.signUpForm.get('username')?.enable();
    }    
    
    /**
     * Registrarse
     */
    signUp(): void {
        console.log('Sign Up called'); // Añadir para depuración
    
        if (this.signUpForm.invalid) {
            console.log('Form is invalid'); // Añadir para depuración
            return;
        }
    
        this.signUpForm.disable();
        this.showAlert = false;
    
        this._authService.signUp(this.signUpForm.value).subscribe(
            (response) => {
                this._router.navigateByUrl('/confirmation-required');
            },
            (error) => {
                this.signUpForm.enable();
                console.error('Detalles del error de registro:', error.error);
    
                // Limpiar errores del formulario
                this.backendErrors = {};

                if (error.error) {
                    for (const key in error.error) {
                        if (error.error.hasOwnProperty(key)) {
                            this.backendErrors[key] = error.error[key].map(
                                (msg: string) => this.errorMessages[msg] || msg
                            );
                            this.signUpForm
                                .get(key)
                                ?.setErrors({ backend: true });
                        }
                    }                
                } else if (error.message) {
                    this.alert = {
                        type: 'error',
                        message: error.message,
                    };
                }
    
                this.alert = {
                    type: 'error',
                    message: 'Ocurrió un error durante el registro.',
                };
                this.showAlert = true;
            }
        );
    }
    

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }
}