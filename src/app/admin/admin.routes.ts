import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { PageNotFound } from '../shared/page-not-found/page-not-found';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboard }
    ]
  },
  {
    path: '**', component: PageNotFound
  }
];