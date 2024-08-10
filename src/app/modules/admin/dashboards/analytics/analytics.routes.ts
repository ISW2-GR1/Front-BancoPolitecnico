import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AnalyticsComponent } from 'app/modules/admin/dashboards/analytics/analytics.component';

export default [
    {
        path     : '',
        component: AnalyticsComponent,
        resolve  : {
        },
    },
] as Routes;
