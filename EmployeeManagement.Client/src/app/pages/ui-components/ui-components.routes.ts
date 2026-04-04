import { Routes } from '@angular/router';

// ui
import { AppFormsComponent } from './forms/forms.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'forms',
        component: AppFormsComponent,
      },
    ],
  },
];
