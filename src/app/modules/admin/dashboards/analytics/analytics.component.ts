import { CommonModule, DatePipe, DecimalPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgClass } from '@angular/common';
import { UserService } from 'app/core/user/user.service';
import { BankAccountService } from 'app/services/bank-account.service';
import { Subscription } from 'rxjs';
import { User } from 'app/core/user/user.types';

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, NgClass, CommonModule],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    editProfileForm: FormGroup;
    changePasswordForm: FormGroup;

    @ViewChild('editProfileDialog', { static: true }) editProfileDialog: TemplateRef<any>;
    @ViewChild('changePasswordDialog', { static: true }) changePasswordDialog: TemplateRef<any>;
    showAlert: boolean = false;
    alert = { type: 'error', message: '' };
    private _bankAccountSubscription: Subscription;
    userDetails: any;
    bankAccounts: any[] = [];
    selectedAccount: any;
    defaultAvatar: string = 'https://img1.pnghut.com/12/24/21/aPnT6zYdni/user-profile-black-facebook-linkedin-symbol.jpg';
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
        joinDate: new Date()
    };
    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _bankAccountService: BankAccountService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.editProfileForm = this._formBuilder.group({
            cedula: [{ value: '', disabled: true }, Validators.required],
            name: [{ value: '', disabled: true }, Validators.required],
            last_name: [{ value: '', disabled: true }, Validators.required],
            email: [{ value: '', disabled: true }, Validators.required],
            username: ['', Validators.required],
            password: [{ value: '', disabled: true }, Validators.required],
            phone: [{ value: '', disabled: true }, Validators.required],
            address: [{ value: '', disabled: true }, Validators.required],
            city: [{ value: '', disabled: true }, Validators.required],
            country: [{ value: '', disabled: true }, Validators.required]
        });

        this._userSubscription = this._userService.get().subscribe((user: User) => {
            this.user = user;
            console.log('Usuario:', this.user);
            if (!this.user.joinDate) {
                this.user.joinDate = new Date();
            }
            this.cdr.markForCheck();

            this.editProfileForm.patchValue({
                cedula: this.user.cedula,
                name: this.user.name,
                last_name: this.user.last_name,
                email: this.user.email,
                username: this.user.username,
                password: '',
                phone: this.user.phone,
                address: this.user.address,
                city: this.user.city,
                country: this.user.country
            });
        });
    

        this.changePasswordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required]
        });
        
        this.loadBankAccounts();
    }

    ngOnDestroy(): void { }

    openEditProfileDialog(): void {
        this._dialog.open(this.editProfileDialog, {
            width: '400px',
            disableClose: true
        });
    }

    openSettingsDialog(): void {
        this._dialog.open(this.changePasswordDialog, {
            width: '400px',
            disableClose: true
        });
    }

    closeDialog(): void {
        this._dialog.closeAll();
    }

    closeEditProfileDialog(): void {
        this._dialog.closeAll();
    }

    onSaveProfile(): void {
        if (this.editProfileForm.valid) {
            const updatedProfile = this.editProfileForm.value;
            console.log('Datos actualizados:', updatedProfile);
            this._userService.updateProfile(updatedProfile).subscribe(
                response => {
                    console.log('Respuesta del servidor:', response);
                    this.user.name = updatedProfile.username;
                    this.closeEditProfileDialog();
                },
                error => {
                    console.error('Error al actualizar el perfil:', error);
                    this.showAlert = true;
                    this.alert = { type: 'error', message: 'Error al actualizar el perfil.' };
                }
            );
        }
    }
    


    onChangePassword(): void {
        if (this.changePasswordForm.valid) {
            console.log('Contraseña cambiada', this.changePasswordForm.value);
            this.closeDialog();
        } else {
            this.showAlert = true;
            this.alert.message = 'Por favor, complete todos los campos requeridos.';
        }
    }
    loadBankAccounts(): void {
        this._bankAccountSubscription = this._bankAccountService.getBankAccounts().subscribe(
            (response) => {
                const primaryAccount = response.find(account => account.is_primary === true);
                this.bankAccounts = primaryAccount ? [primaryAccount] : [];
                this.cdr.markForCheck();
                console.log('Cuentas bancarias:', this.bankAccounts);
            },
            (error) => {
                console.error('Error al obtener las cuentas bancarias:', error);
            }
        );
    }
    
}