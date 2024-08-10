import { DecimalPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, NgClass],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    editProfileForm: FormGroup;
    changePasswordForm: FormGroup;

    @ViewChild('editProfileDialog', { static: true }) editProfileDialog: TemplateRef<any>;
    @ViewChild('changePasswordDialog', { static: true }) changePasswordDialog: TemplateRef<any>;
    showAlert: boolean = false;
    alert = { type: 'error', message: '' };

    constructor(
        private _router: Router,
        private _dialog: MatDialog,
        private _formBuilder: FormBuilder
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

        this.changePasswordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required]
        });


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

    onSaveProfile(): void {
        if (this.editProfileForm.valid) {
            console.log('Perfil guardado', this.editProfileForm.value);
            this.closeDialog();
        } else {
            this.showAlert = true;
            this.alert.message = 'Por favor, complete todos los campos requeridos.';
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
}