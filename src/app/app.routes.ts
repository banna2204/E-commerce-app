import { Routes } from '@angular/router';
import { PageNotFound } from './shared/page-not-found/page-not-found';
import { authGuard } from './shared/auth-guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/authentication/login/login').then((m)=>m.Login),
    },
    {
        path:'registration',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/authentication/registration/registration').then((m)=>m.Registration),
    },
    {
        path:'forget-password',
        loadComponent: () => import('./shared/authentication/forget-account/forget-account').then((m)=> m.ForgetAccount),
    },
    {
        path:'reset-password',
        loadComponent: () => import('./shared/authentication/reset-password/reset-password').then((m) => m.ResetPassword),
    },
    {
        path:'customer',
        canActivate: [authGuard],
        loadChildren: () => import('./customer/customer.routes').then((m)=> m.CUSTOMER_ROUTES)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.routes').then((m)=> m.ADMIN_ROUTES),
    },
    {
        path: '**', component: PageNotFound
    }
];
