import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        loadComponent: () => import('./shared/authentication/login/login').then((m)=>m.Login),
    },
    {
        path:'registration',
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
        loadChildren: () => import('./customer/customer.routes').then((m)=> m.CUSTOMER_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then((m)=> m.ADMIN_ROUTES),
    }
];
