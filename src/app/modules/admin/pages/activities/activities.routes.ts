import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ActivitiesComponent } from 'app/modules/admin/pages/activities/activities.component';

export default [
    {
        path     : '',
        component: ActivitiesComponent,
        resolve  : {
        },
    },
] as Routes;
