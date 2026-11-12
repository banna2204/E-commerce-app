import { Routes } from '@angular/router';
import { CustomerLayout } from './customer-layout/customer-layout';
import { Home } from './home/home';
import { PageNotFound } from '../shared/page-not-found/page-not-found';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', component: Home },
      { path: 'categories', loadComponent: () => import('../customer/components/all-categories/all-categories').then((m)=> m.AllCategories) },
      { path: 'products', loadComponent: () => import('../customer/components/all-products/all-products').then((m)=> m.AllProducts) },
      { path: 'category-detail/:id', loadComponent: () => import('../customer/components/category-detail/category-detail').then((m)=> m.CategoryDetail) },
      { path: 'product-detail/:id', loadComponent: () => import('../customer/components/product-detail/product-detail').then((m) => m.ProductDetail)},
      { path: 'wishlist', loadComponent: () => import('../customer/components/wishlist/wishlist').then((m)=>m.Wishlist)},
      { path: 'addToCart', loadComponent: () => import('../customer/components/add-to-cart/add-to-cart').then((m)=>m.AddToCart)}
    ]
  },
  {
    path: '**', component: PageNotFound
  }
];