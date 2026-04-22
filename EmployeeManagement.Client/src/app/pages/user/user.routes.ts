import { Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
      },
    ],
  },
];
