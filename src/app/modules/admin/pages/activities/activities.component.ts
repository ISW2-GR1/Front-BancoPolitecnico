import {
    AsyncPipe,
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
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoTranspilerFunction } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { DateTime } from 'luxon';

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
        DatePipe
    ],
})
export class ActivitiesComponent implements OnInit {

    transactions$: Observable<any[]>; // Cambia el tipo a un array de objetos genéricos

    /**
     * Constructor
     */
    constructor() {}

    /**
     * On init
     */
    ngOnInit(): void {
        // Datos de ejemplo
        const transactions = [
            { date: '2024-08-01', description: 'Transferencia Recibida', amount: 150.00, type: 'Ingreso' },
            { date: '2024-08-03', description: 'Pago de Servicios', amount: -50.00, type: 'Egreso' },
            { date: '2024-08-04', description: 'Compra en Supermercado', amount: -75.00, type: 'Egreso' },
            { date: '2024-08-05', description: 'Transferencia Enviada', amount: -200.00, type: 'Egreso' }
        ];

        this.transactions$ = of(transactions);
    }

    generatePdf() {
        // Implementa la lógica para generar un PDF
        console.log('Generating PDF...');
    }

    getRelativeFormat(date: string): string {
        return DateTime.fromISO(date).toRelative(); 
    }

    isSameDay(date1: string, date2: string): boolean {
        const dt1 = DateTime.fromISO(date1);
        const dt2 = DateTime.fromISO(date2);
        return dt1.hasSame(dt2, 'day');
    }
    applyFilters() {
        // Implementa la lógica para aplicar filtros
        console.log('Applying filters...');
    }
}
