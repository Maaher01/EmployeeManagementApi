import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Page404Component } from './pages/page404/page404.component';
import { Page403Component } from './pages/page403/page403.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./pages/employee/employee.routes').then(
            (m) => m.EmployeeRoutes,
          ),
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./pages/user/user.routes').then((m) => m.UserRoutes),
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./pages/department/department.routes').then(
            (m) => m.DepartmentRoutes,
          ),
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.routes').then((m) => m.ProfileRoutes),
      },
    ],
  },
  {
    path: '',
    component: AuthComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((m) => m.AuthRoutes),
      },
    ],
  },
  {
    path: 'unauthorized',
    component: Page403Component,
  },
  {
    path: '**',
    component: Page404Component,
  },
];
