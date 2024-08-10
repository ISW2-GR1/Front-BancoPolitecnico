import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * En inicialización
     */
    ngOnInit(): void
    {
        // Crear el formulario
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Métodos públicos
    // -----------------------------------------------------------------------------------------------------

    /**
     * Enviar el enlace de reinicio
     */
    sendResetLink(): void
    {
        // Regresar si el formulario es inválido
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Desactivar el formulario
        this.forgotPasswordForm.disable();

        // Ocultar la alerta
        this.showAlert = false;

        // Olvidó la contraseña
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
            .pipe(
                finalize(() =>
                {
                    // Volver a habilitar el formulario
                    this.forgotPasswordForm.enable();

                    // Restablecer el formulario
                    this.forgotPasswordNgForm.resetForm();

                    // Mostrar la alerta
                    this.showAlert = true;
                }),
            )
            .subscribe(
                (response) =>
                {
                    // Establecer la alerta
                    this.alert = {
                        type   : 'success',
                        message: '¡Enlace de reinicio de contraseña enviado! Recibirás un correo electrónico si estás registrado en nuestro sistema.',
                    };
                },
                (response) =>
                {
                    // Establecer la alerta
                    this.alert = {
                        type   : 'error',
                        message: '¡Correo electrónico no encontrado! ¿Estás seguro de que ya eres miembro?',
                    };
                },
            );
    }
}