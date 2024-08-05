import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule, RouterLink, FuseCardComponent, MatIconModule, MatButtonModule,
        MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule,
        MatDividerModule, MatTooltipModule, NgClass, MatDialogModule
    ],
})
export class ProfileComponent {
    @ViewChild('addAccountDialog') addAccountDialog: TemplateRef<any>;
    @ViewChild('confirmDeleteDialog') confirmDeleteDialog: TemplateRef<any>;
    @ViewChild('verifyCodeDialog') verifyCodeDialog: TemplateRef<any>;

    userName = 'Brian Hughes';
    userLocation = 'London, UK';
    bankAccounts = [
        { number: '1234567890', balance: 5000 },
        { number: '0987654321', balance: 3000 },
        { number: '1122334455', balance: 1500 },
        { number: '5566778899', balance: 2500 }
    ];
    cedulaNumber = '';
    verificationCode = '';
    verificationSent = false;
    accountToDelete: string;

    constructor(private dialog: MatDialog) { }

    openAddAccountDialog(): void {
        this.dialog.open(this.addAccountDialog);
    }

    sendVerificationCode(): void {
        // Logic to send verification code
        this.verificationSent = true;
    }

    verifyCode(): void {
        // Logic to verify the code
        if (this.verificationCode === '123456') {
            // Code verified successfully
            this.dialog.closeAll();
            // Logic to add new bank account
        } else {
            // Verification failed
        }
    }

    openConfirmDeleteDialog(accountNumber: string): void {
        this.accountToDelete = accountNumber;
        this.dialog.open(this.confirmDeleteDialog);
    }

    confirmDelete(): void {
        // Open verification dialog
        this.dialog.closeAll();
        this.dialog.open(this.verifyCodeDialog);
    }

    verifyAndDelete(): void {
        // Logic to verify the code
        if (this.verificationCode === '123456') {
            // Code verified successfully
            this.bankAccounts = this.bankAccounts.filter(account => account.number !== this.accountToDelete);
            this.dialog.closeAll();
        } else {
            // Verification failed
        }
    }

    learnMore(): void {
        alert('Más información sobre la promoción.');
    }
}