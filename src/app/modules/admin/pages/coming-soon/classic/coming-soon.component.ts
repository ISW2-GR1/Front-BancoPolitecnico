import { NgIf, CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Importar MatSelectModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { TransferMoneyService } from 'app/services/transfer-money.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'app/core/user/user.types';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BankAccountService } from 'app/services/bank-account.service';

// import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component'; // Ajusta la ruta según tu estructura

@Component({
    selector: 'coming-soon-classic',
    templateUrl: './coming-soon.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgIf,
        CommonModule,
        FuseAlertComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule

    ],
})
export class ComingSoonClassicComponent implements OnInit {
    @ViewChild('otpModal') otpModal: TemplateRef<any>;
    @ViewChild('addContactModal') addContactModal: TemplateRef<any>;
    dialogRef: MatDialogRef<any>;
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
        account_numbers: []
    };
    private _userSubscription: Subscription;
    defaultAvatar: string = 'https://img1.pnghut.com/12/24/21/aPnT6zYdni/user-profile-black-facebook-linkedin-symbol.jpg';
    isBalanceVisible: boolean = true;
    otpCode: string = '';
    searchResults: any[] = [];

    transferForm: FormGroup;
    contactForm: FormGroup;
    userAccountNumbers: string[] = [];
    contactList: any[] = [];

    showAlert = false;
    alert: { type: string, message: string } = { type: '', message: '' };
    bankAccounts: any[] = [];


    /**
     * Constructor
     */
    constructor(
        private fb: FormBuilder,
        private transferService: TransferMoneyService,
        private userService: UserService,
        public dialog: MatDialog,
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private _bankAccountService: BankAccountService
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        
        this._userSubscription = this._userService.get().subscribe((user: User) => {
            console.log("DataUser", user);
            this.user = user;
            this.contactList = user.contacts;
            console.log('Updated Contact List:', this.contactList);
            this.cdr.detectChanges();
        });
        this.transferForm = this.fb.group({
            senderAccount: [null, Validators.required],
            receiverAccount: [null, Validators.required],
            amount: [null, [Validators.required, Validators.min(0)]],
            otp: [null]
        });

        this.contactForm = this.fb.group({
            account_number: ['', Validators.required],
            cedula: ['', Validators.required]
        });

        this.loadBankAccounts();
        
    }
    loadBankAccounts(): void {
        this._bankAccountService.getBankAccounts().subscribe(
            (response) => {
                this.bankAccounts = response.filter(account => account.is_active);
                this.cdr.detectChanges();
            },
            (error) => {
                console.error('Error al cargar las cuentas bancarias:', error);
            }
        );
    }
    
    
    submitTransfer(): void {
        if (this.transferForm.valid) {
            const { senderAccount, receiverAccount, amount } = this.transferForm.value;
            console.log('Cuenta de Origen seleccionada:', senderAccount); // Añadir esto para depuración
    
            this.transferService.createTransfer({ sender_account: senderAccount, receiver_account: receiverAccount, amount }).subscribe(
                response => {
                    this.openOtpModal();
                },
                error => {
                    console.error('Error en la transferencia inicial:', error);
                    this.alert = { type: 'error', message: error.error?.non_field_errors?.join(', ') || 'Error al realizar la transferencia inicial' };
                    this.showAlert = true;
                }
            );
        }
    }
    

    openOtpModal(): void {
        this.dialogRef = this.dialog.open(this.otpModal);
        this.showAlert = false;

        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.confirmTransfer();
            }
        });
    }


    confirmTransfer(): void {
        if (this.otpCode.trim()) {
            this.transferService.confirmTransfer({ otp: this.otpCode }).subscribe(
                confirmResponse => {
                    this.dialogRef.close();
                    this.alert = { type: 'success', message: 'Transferencia realizada con éxito' };
                    this.showAlert = true;
                    this.transferForm.reset();
                    this.otpCode = '';
                    Object.keys(this.transferForm.controls).forEach(key => {
                        this.transferForm.controls[key].setErrors(null);
                        this.transferForm.controls[key].markAsPristine();
                        this.transferForm.controls[key].markAsUntouched();
                    });
                },
                error => {
                    console.error('Error al confirmar la transferencia:', error);
                    // Mostrar todos los errores del backend
                    this.dialogRef.close();
                    this.otpCode = '';
                    this.transferForm.reset();
                    this.alert = { type: 'error', message: error.error?.non_field_errors?.join(', ') || 'Error al confirmar la transferencia' };
                    this.showAlert = true;
                    this.cdr.detectChanges();
                }
            );
        } else {
            this.alert = { type: 'error', message: 'Debe ingresar un código OTP válido' };
            this.showAlert = true;
            this.cdr.detectChanges();
        }
    }

    openAddContactDialog(): void {
        this.dialogRef = this.dialog.open(this.addContactModal, {
            width: '400px'
        });


        this.dialogRef.afterClosed().subscribe(result => {
            console.log('Modal cerrado con resultado:', result);
            if (result) {
                console.log('Contacto seleccionado:', result);

            }
        });
        this.resetContactForm();
    }


    searchContact(): void {
        if (this.contactForm.valid) {
            this.transferService.searchContact(this.contactForm.value).subscribe(
                results => {
                    this.searchResults = results;
                    this.showAlert = false;
                },
                error => {
                    this.showAlert = true;
                    this.alert = { type: 'error', message: 'No se ha encontrado ningún contacto con ese número de cuenta o cédula' };
                }
            );
        }
    }

    cancelSearch(): void {
        this.dialogRef.close();
        this.showAlert = false;
        this.resetContactForm();
    }

    resetContactForm(): void {
        this.contactForm.reset();
        this.searchResults = [];
        Object.keys(this.contactForm.controls).forEach(key => {
            this.contactForm.controls[key].setErrors(null);
            this.contactForm.controls[key].markAsPristine();
            this.contactForm.controls[key].markAsUntouched();
        });
    }

    selectContact(contact: any): void {
        const contactData = {
            contact: contact.id,
            contact_account_number: contact.account_number
        };

        console.log('Datos enviados:', contactData);

        this.transferService.addContact(contactData).subscribe(
            response => {
                this._userService.get().subscribe((user: User) => {
                    this.user = user;
                    this.contactList = user.contacts;
                    this.alert = { type: 'success', message: 'Contacto añadido con éxito' };
                    this.showAlert = true;
                    this.dialogRef.close();
                    this.resetContactForm();
                    console.log('Contacto añadido exitosamente y lista actualizada', user);
                });
            },
            error => {
                this.alert = { type: 'error', message: 'No se ha podido añadir al usuario' };
                this.showAlert = true;
                console.error('Error al añadir contacto', error);
            }
        );
    }



}