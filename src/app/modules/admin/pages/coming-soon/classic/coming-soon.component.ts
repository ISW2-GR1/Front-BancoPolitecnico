import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Importar MatSelectModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { TransferMoneyService } from 'app/services/transfer-money.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// import { AddContactDialogComponent } from './add-contact-dialog/add-contact-dialog.component'; // Ajusta la ruta según tu estructura

@Component({
    selector: 'coming-soon-classic',
    templateUrl: './coming-soon.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf, 
        FuseAlertComponent, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatSelectModule, 
        MatButtonModule, 
        MatProgressSpinnerModule,
        MatIconModule
    ],
})
export class ComingSoonClassicComponent implements OnInit {
    transferForm: FormGroup;
    userAccountNumbers: string[] = [];
    showAlert = false;
    alert: { type: string, message: string } = { type: '', message: '' };

    /**
     * Constructor
     */
    constructor(
        private fb: FormBuilder,
        private transferService: TransferMoneyService,
        private userService: UserService,
        public dialog: MatDialog
    ) {}

    /**
     * On init
     */
    ngOnInit(): void {
        this.transferForm = this.fb.group({
            senderAccount: [null, Validators.required],
            receiverAccount: [null, Validators.required],
            amount: [null, [Validators.required, Validators.min(0)]],
            otp: [null, Validators.required]
        });

        this.userService.get().subscribe(user => {
            this.userAccountNumbers = user.account_numbers;
        });
    }

    submitTransfer(): void {
        if (this.transferForm.valid) {
            const { senderAccount, receiverAccount, amount, otp } = this.transferForm.value;
            this.transferService.createTransfer({ sender_account: senderAccount, receiver_account: receiverAccount, amount }).subscribe(
                response => {
                    this.transferService.confirmTransfer({ otp }).subscribe(
                        confirmResponse => {
                            this.alert = { type: 'success', message: 'Transferencia realizada con éxito' };
                            this.showAlert = true;
                        },
                        error => {
                            this.alert = { type: 'error', message: 'Error al confirmar la transferencia' };
                            this.showAlert = true;
                        }
                    );
                },
                error => {
                    this.alert = { type: 'error', message: 'Error al realizar la transferencia' };
                    this.showAlert = true;
                }
            );
        }
    }

    openAddContactDialog(): void {
        // const dialogRef = this.dialog.open(AddContactDialogComponent, {
        //     width: '400px',
        //     data: {} // Pasa los datos necesarios al diálogo
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('El diálogo se cerró');
        //     // Manejar el resultado después de que el diálogo se cierre
        // });
    }
}