import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, 
        MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, 
        MatCheckboxModule, MatProgressSpinnerModule
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

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
    ) {}

    /**
     * On init
     */
    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            username: ['', Validators.required],
            last_name: ['', Validators.required],
            cedula: ['', Validators.required],
            agreements: [false, Validators.requiredTrue], // Assuming this is a checkbox
        });
    }

    /**
     * Sign up
     */
    signUp(): void {
        if (this.signUpForm.invalid) {
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
                console.error('Sign-up error details:', error.error);
                
                let errorMessage = 'An error occurred during sign up.';

                if (error.error) {
                    const errorMessages: string[] = [];

                    for (const key in error.error) {
                        if (error.error.hasOwnProperty(key)) {
                            errorMessages.push(...error.error[key]);
                        }
                    }

                    if (errorMessages.length > 0) {
                        errorMessage = errorMessages.join(' ');
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }

                this.alert = {
                    type: 'error',
                    message: errorMessage,
                };
                this.showAlert = true;
            }
        );
    }
}