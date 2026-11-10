import { Routes } from '@angular/router';
import { CustomerLayout } from './customer-layout/customer-layout';
import { Home } from './home/home';


export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', component: Home }
    ]
  }
];