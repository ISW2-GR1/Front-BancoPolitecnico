import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    TemplateRef,
    ViewEncapsulation,
    ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { BankAccountService } from 'app/services/bank-account.service';
import { FormsModule } from '@angular/forms';
import { FuseAlertComponent } from '@fuse/components/alert';
@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FuseCardComponent,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatTooltipModule,
        NgClass,
        MatDialogModule,
        FormsModule,
        MatSnackBarModule,
        FuseAlertComponent,
    ],
})
export class ProfileComponent {
    @ViewChild('addAccountDialog') addAccountDialog: TemplateRef<any>;
    @ViewChild('confirmDeleteDialog') confirmDeleteDialog: TemplateRef<any>;
    @ViewChild('verifyCodeDialog') verifyCodeDialog: TemplateRef<any>;

    cedulaNumber = '';
    verificationCode = '';
    verificationSent = false;
    accountToDelete: string;
    showAlert = false;
    alert = { type: 'success' as 'success' | 'error', message: '' };
    bankAccounts = [];

    constructor(
        private dialog: MatDialog,
        private _bankAccountService: BankAccountService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadBankAccounts();
    }

    openAddAccountDialog(): void {
        const dialogRef = this.dialog.open(this.addAccountDialog, {
            width: '400px',
            panelClass: 'custom-dialog',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.cedulaNumber = '';
            this.verificationCode = '';
            this.verificationSent = false;
        });
    }

    showAlertMessage(
        message: string,
        type: 'success' | 'error' = 'success'
    ): void {
        this.alert = { type, message };
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
    }

    sendVerificationCode(): void {
        if (!this.cedulaNumber.trim()) {
            this.showAlertMessage('El número de cédula es requerido.', 'error');
            return;
        }
    
        if (this.cedulaNumber.length < 10) {
            this.showAlertMessage(
                'El número de cédula debe tener al menos 10 dígitos.',
                'error'
            );
            return;
        }
    
        this._bankAccountService.verifyIdentity(this.cedulaNumber).subscribe(
            (response) => {
                if (
                    response &&
                    response.detail === 'Código de verificación enviado al usuario.'
                ) {
                    this.verificationSent = true;
                    this.dialog.open(this.verifyCodeDialog, {
                        width: '400px',
                        panelClass: 'custom-dialog',
                    });
                    this.showAlertMessage(
                        'Código de verificación enviado a su correo electrónico.',
                        'success'
                    );
                } else {
                    this.showAlertMessage(
                        'Error al enviar el código de verificación.',
                        'error'
                    );
                }
            },
            (error) => {
                console.error('Error al enviar el código de verificación:', error);
                this.showAlertMessage(
                    'Error al enviar el código de verificación. Intente nuevamente.',
                    'error'
                );
            }
        );
    }
    verifyCode(): void {
        if (!this.verificationCode.trim()) {
            this.showAlertMessage(
                'El código de verificación es requerido.',
                'error'
            );
            return;
        }
    
        this._bankAccountService.verifyCode(this.verificationCode).subscribe(
            (response) => {
                if (
                    response &&
                    response.detail ===
                        'Cuenta bancaria creada con éxito y correo enviado.'
                ) {
                    this.showSuccessMessage('Cuenta creada exitosamente.');
                    this.dialog.closeAll();
                    this.cedulaNumber = '';
                    this.verificationCode = '';
                    this.verificationSent = false;
                } else {
                    this.showAlertMessage(
                        'Error al crear la cuenta. Verifique el código de verificación.',
                        'error'
                    );
                }
            },
            (error) => {
                console.error('Error al verificar el código:', error);
                this.showAlertMessage(
                    'Error al verificar el código. Intente nuevamente.',
                    'error'
                );
            }
        );
    }    

    openConfirmDeleteDialog(accountNumber: string): void {
        this.accountToDelete = accountNumber;
        this.dialog.open(this.confirmDeleteDialog, {
            width: '400px',
            panelClass: 'custom-dialog',
        });
    }
    confirmDelete(): void {
        // Implement your delete logic here
        this.showAlertMessage(
            `Cuenta ${this.accountToDelete} eliminada exitosamente.`,
            'success'
        );
        this.dialog.closeAll();
    }

    learnMore(): void {
        console.log('Mostrar más información');
    }

    showSuccessMessage(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
        });
    }

    loadBankAccounts(): void {
        this._bankAccountService.getBankAccounts().subscribe(
            (response) => {
                this.bankAccounts = response;
                this.cdr.detectChanges();  // Forzar la detección de cambios
                console.log('Cuentas bancarias:', this.bankAccounts);
            },
            (error) => {
                console.error('Error al obtener las cuentas bancarias:', error);
                this.showAlertMessage(
                    'Error al cargar las cuentas bancarias. Intente nuevamente.',
                    'error'
                );
            }
        );
    }    
    
}
