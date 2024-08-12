import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserService } from 'app/core/user/user.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { User } from 'app/core/user/user.types';
import { CommonModule } from '@angular/common';
import { BankAccountService } from 'app/services/bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        TranslocoModule, 
        MatIconModule, 
        MatButtonModule, 
        MatRippleModule, 
        MatMenuModule, 
        MatTabsModule, 
        MatButtonToggleModule, 
        NgApexchartsModule, 
        NgFor, 
        NgIf, 
        MatTableModule, 
        NgClass, 
        CurrencyPipe,
        CommonModule,
    ],
})
export class ProjectComponent implements OnInit, OnDestroy {
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
    private _userSubscription: Subscription;
    defaultAvatar: string = 'https://img1.pnghut.com/12/24/21/aPnT6zYdni/user-profile-black-facebook-linkedin-symbol.jpg';
    isBalanceVisible: boolean = true;
    private _bankAccountSubscription: Subscription;
    bankAccounts: any[] = [];
    selectedAccount: any;
    totalBalance: number = 0;
    showTotalBalance: boolean = false;

    constructor(
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private _bankAccountService: BankAccountService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this._userSubscription = this._userService.get().subscribe((user: User) => {
            this.user = user;
            if (!this.user.joinDate) {
                this.user.joinDate = new Date();
            }
            this.cdr.markForCheck();
        });
        this.loadBankAccounts();
    }
    
    ngOnDestroy(): void {
        if (this._userSubscription) {
            this._userSubscription.unsubscribe();
        }
    }

    toggleTotalBalanceVisibility(): void {
        this.showTotalBalance = !this.showTotalBalance;
    }

    loadBankAccounts(): void {
        this._bankAccountSubscription = this._bankAccountService.getBankAccounts().subscribe(
            (response) => {
                this.bankAccounts = response
                    .filter(account => account.is_active)
                    .map(account => ({
                        ...account,
                        showBalance: false,
                        balance: Number(account.balance)
                    }));
                    
                console.log('Bank Accounts:', this.bankAccounts);
                this.totalBalance = this.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
        
                console.log('Total Balance:', this.totalBalance);
        
                this.cdr.markForCheck();
            },
            (error) => {
                console.error('Error al obtener las cuentas bancarias:', error);
            }
        );
    }
    
    
    toggleBalanceVisibility(account: any): void {
        account.showBalance = !account.showBalance;
    }
    

    shareAccountDetails(account: any): void {
        const details = `
            Banco Politécnico
            Tipo: AHORROS
            Número cuenta: ${account.account_number}
            Nombre: ${this.user.name} ${this.user.last_name}
            RUC/Identificación: ${this.user.cedula}
            Correo: ${this.user.email}
            Celular: ${this.user.phone}
        `;
    
        navigator.clipboard.writeText(details).then(() => {
            this.snackBar.open('Número de cuenta copiado al portapapeles', 'Cerrar', {
                duration: 2000,
            });
        }).catch(err => {
            console.error('Error al copiar los detalles de la cuenta: ', err);
        });
    }

    showAccountInfo(account: any): void {
        this.selectedAccount = account;
    }
    
    hideAccountInfo(): void {
        this.selectedAccount = null;
    }

}