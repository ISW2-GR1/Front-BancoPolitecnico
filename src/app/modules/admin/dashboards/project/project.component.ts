import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { User } from 'app/core/user/user.types'; // Asegúrate de que User esté correctamente importado

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
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
        CurrencyPipe
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
        avatar: ''
    };
    private _userSubscription: Subscription;
    defaultAvatar: string = 'https://img1.pnghut.com/12/24/21/aPnT6zYdni/user-profile-black-facebook-linkedin-symbol.jpg';
    isBalanceVisible: boolean = true;
    balance: number = 120;
    transactions: number = 5; 

    constructor(
        private _userService: UserService,
        private cdr: ChangeDetectorRef // Injecta ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._userSubscription = this._userService.get().subscribe((user: User) => {
            console.log('User from service:', user);
            this.user = user;
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        if (this._userSubscription) {
            this._userSubscription.unsubscribe();
        }
    }

    toggleBalanceVisibility(): void {
        this.isBalanceVisible = !this.isBalanceVisible;
    }
}