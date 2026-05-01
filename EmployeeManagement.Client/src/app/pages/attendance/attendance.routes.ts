import { Routes } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';

export const AttendanceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AttendanceListComponent,
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./attendance-settings/attendance-settings.routes').then(
            (m) => m.AttendanceSettingRoutes,
          ),
      },
    ],
  },
];
