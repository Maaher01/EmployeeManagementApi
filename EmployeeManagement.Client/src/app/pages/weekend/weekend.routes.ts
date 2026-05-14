import { Routes } from '@angular/router';

import { WeekendListComponent } from './weekend-list/weekend-list.component';

export const WeekendRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: WeekendListComponent,
      },
    ],
  },
];
