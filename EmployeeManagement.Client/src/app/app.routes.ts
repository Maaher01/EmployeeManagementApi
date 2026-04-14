import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./pages/employee/employee.routes').then(
            (m) => m.EmployeeRoutes,
          ),
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./pages/department/department.routes').then(
            (m) => m.DepartmentRoutes,
          ),
      },
    ],
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((m) => m.AuthRoutes),
      },
    ],
  },
];
