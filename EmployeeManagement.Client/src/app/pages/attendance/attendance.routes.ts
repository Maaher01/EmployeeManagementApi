import { Routes } from '@angular/router';

export const AttendanceRoutes: Routes = [
  {
    path: '',
    children: [
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
