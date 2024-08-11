import {
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    TitleCasePipe,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { TransferMoneyService } from 'app/services/transfer-money.service';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'activity',
    templateUrl: './activities.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        RouterLink,
        AsyncPipe,
        TitleCasePipe,
        DatePipe,
        CurrencyPipe,
        ReactiveFormsModule
    ],
})
export class ActivitiesComponent implements OnInit {
    public transactions: any[] = [];
    public filteredTransactions: any[] = [];
    filterForm: FormGroup;

    constructor(
        private _transferMoneyService: TransferMoneyService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.filterForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
    }

    ngOnInit(): void {
        this.getTransactions();
    }

    getTransactions(): void {
        this._transferMoneyService.transferSummary()
            .subscribe((transactions: any) => {
                this.transactions = transactions;
                this.filteredTransactions = transactions; // Mostrar todas las transacciones inicialmente
                this.cdr.detectChanges();
            });
    }

    applyFilter(): void {
        const { fromDate, toDate } = this.filterForm.value;
        if (fromDate || toDate) {
            this.filteredTransactions = this.transactions.filter(transaction => {
                const transactionDate = new Date(transaction.timestamp);
                return (!fromDate || transactionDate >= fromDate) &&
                       (!toDate || transactionDate <= toDate);
            });
        } else {
            this.filteredTransactions = this.transactions; // Si no hay filtro, mostrar todas
        }
        this.cdr.detectChanges();
    }

    generatePDF(): void {
        const doc = new jsPDF();

        const table = document.getElementById('transactionsTable');
        if (table) {
            html2canvas(table).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                doc.save('Resumen_Transacciones.pdf');
            });
        }
    }
}
