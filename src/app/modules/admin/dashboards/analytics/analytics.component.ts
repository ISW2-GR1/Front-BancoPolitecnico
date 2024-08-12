import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgClass } from '@angular/common';
import { UserService } from 'app/core/user/user.service';
import { BankAccountService } from 'app/services/bank-account.service';
import { Subscription } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTooltipModule,
        NgFor,
        DecimalPipe,
        NgClass,
        CommonModule,
        ReactiveFormsModule,
        FuseAlertComponent,
        RouterLink,
        FuseCardComponent,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatDialogModule,
        FormsModule,
        MatSnackBarModule,
    ],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    editProfileForm: FormGroup;
    changePasswordForm: FormGroup;

    @ViewChild('editProfileDialog') editProfileDialog: TemplateRef<any>;
    @ViewChild('changePasswordDialog') changePasswordDialog: TemplateRef<any>;
    showAlert: boolean = false;
    alert = { type: 'error', message: '' };
    private _bankAccountSubscription: Subscription;
    userDetails: any;
    bankAccounts: any[] = [];
    selectedAccount: any;
    defaultAvatar: string =
        'https://img1.pnghut.com/12/24/21/aPnT6zYdni/user-profile-black-facebook-linkedin-symbol.jpg';
    private _userSubscription: Subscription;
    user: User = {
        name: '',
        last_name: '',
        username: '',
        email: '',
        cedula: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        birthday: null,
        role: '',
        avatar: '',
        balance: 0,
        transactions: 0,
        contacts: [],
        sent_transfers: [],
        received_transfers: [],
        available_balance: 0,
        account_numbers: [],
        joinDate: new Date(),
    };

    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _bankAccountService: BankAccountService,
        private cdr: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        this.editProfileForm = this._formBuilder.group({
            username: ['']
        });

        this.changePasswordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.checkPasswords });
        
        console.log('Formulario de cambio de contraseña inicializado:', this.changePasswordForm);

        this._userSubscription = this._userService
            .get()
            .subscribe((user: User) => {
                this.user = user;
                if (!this.user.joinDate) {
                    this.user.joinDate = new Date();
                }
                this.cdr.markForCheck();
            });

        this.loadBankAccounts();
    }
    
    checkPasswords(group: FormGroup) {
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    
    ngOnDestroy(): void {
        if (this._userSubscription) {
            this._userSubscription.unsubscribe();
        }
        if (this._bankAccountSubscription) {
            this._bankAccountSubscription.unsubscribe();
        }
    }

    openEditProfileDialog(): void {
        this.editProfileForm.patchValue({
            username: ''
        });
        
        this._dialog.open(this.editProfileDialog, {
            width: '400px',
            disableClose: true,
        }).afterClosed().subscribe(() => {
            console.log('Diálogo de edición de perfil cerrado.');
        });
    }
    
    openSettingsDialog(): void {
        this._dialog.open(this.changePasswordDialog, {
            width: '400px',
            disableClose: true,
        }).afterClosed().subscribe(() => {
            console.log('Diálogo de configuración cerrado.');
        });
    }

    closeDialog(): void {
        this._dialog.closeAll();
    }

    onSaveProfile(): void {
        if (this.editProfileForm.valid) {
            const updatedUsername = this.editProfileForm.value.username.trim(); 
            console.log('Actualizando username a:', updatedUsername);
        
            this._userService.updateProfile(updatedUsername).subscribe(
                (response) => {
                    console.log('Respuesta del servidor:', response);
                    this.user.username = updatedUsername;
                    // Reiniciar el formulario con valor vacío
                    this.editProfileForm.reset({ username: '' });
                    // Cerrar el diálogo
                    this.closeDialog();
                    this.cdr.markForCheck(); 
                },
                (error) => {
                    console.error('Error al actualizar el username:', error);
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: 'Error al actualizar el username.',
                    };
                }
            );
        }
    }


    onChangePassword(): void {
        if (this.changePasswordForm.invalid) {
            this.showAlert = true;
            this.alert = {
                type: 'error',
                message: 'Por favor, corrija los errores en el formulario.',
            };
            this.markFormGroupTouched(this.changePasswordForm);
            return;
        }
    
        const { currentPassword, newPassword } = this.changePasswordForm.value;
        this._userService.updatePassword(currentPassword, newPassword).subscribe(
            (response) => {
                this.changePasswordForm.reset();
                this.closeDialog();
                this.showAlert = true;
                this.alert = {
                    type: 'success',
                    message: 'Contraseña actualizada correctamente.',
                };
                this._snackBar.open('Contraseña actualizada correctamente.', 'Cerrar', { duration: 3000 });
    
                // Call logout after successful password change
                this._authService.logout().subscribe(
                    () => {
                        this._router.navigate(['/sign-in']);
                    },
                    (error) => {
                        console.error('Error al cerrar sesión:', error);
                        this._snackBar.open('Error al cerrar sesión. Inténtelo de nuevo.', 'Cerrar', { duration: 5000 });
                    }
                );
            },
            (error) => {
                console.error('Error al cambiar la contraseña:', error);
                this.showAlert = true;
                if (error.error && error.error.old_password) {
                    this.alert.message = error.error.old_password.join(' ');
                } else if (error.error && error.error.new_password) {
                    this.alert.message = error.error.new_password.join(' ');
                } else {
                    this.alert.message = 'Error al cambiar la contraseña.';
                }
                this.alert.type = 'error';
                this._snackBar.open(this.alert.message, 'Cerrar', { duration: 5000 });
            }
        );
    }
    
    
    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
    
    
    
    loadBankAccounts(): void {
        this._bankAccountSubscription = this._bankAccountService
            .getBankAccounts()
            .subscribe(
                (response) => {
                    const primaryAccount = response.find(
                        (account) => account.is_primary === true
                    );
                    this.bankAccounts = primaryAccount ? [primaryAccount] : [];
                    this.cdr.markForCheck();
                    console.log('Cuentas bancarias:', this.bankAccounts);
                },
                (error) => {
                    console.error(
                        'Error al obtener las cuentas bancarias:',
                        error
                    );
                }
            );
    }
}