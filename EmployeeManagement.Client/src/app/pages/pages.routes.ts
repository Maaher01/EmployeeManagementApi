import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      urls: [
        {
          title: 'Dashboard',
          url: '/dashboard',
        },
      ],
    },
  },
];
