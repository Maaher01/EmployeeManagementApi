import { Routes } from '@angular/router';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProfileDetailsComponent,
      },
    ],
  },
];
