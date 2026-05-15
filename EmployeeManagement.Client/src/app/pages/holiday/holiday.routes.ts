import { Routes } from '@angular/router';

import { HolidayListComponent } from './holiday-list/holiday-list.component';

export const HolidayRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HolidayListComponent,
      },
    ],
  },
];
