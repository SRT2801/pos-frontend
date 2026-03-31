import { Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login';
import { RegisterPage } from './modules/pages/register/register';
import { Layout } from './modules/shared/layout/layout';
import { Home } from './modules/pages/home/home';
import { RegisterStore } from './modules/pages/register-store/register-store';
import { DashboardComponent } from './modules/pages/dashboard/dashboard';
import { ProductsPage } from './modules/pages/products/products';
import { CreateProductPage } from './modules/pages/create-product/create-product';
import { ProductDetailPage } from './modules/pages/product-detail/product-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: 'register-store',
        component: RegisterStore,
      },
      {
        path: 'products',
        component: ProductsPage,
      },
      {
        path: 'products/create',
        component: CreateProductPage,
      },
      {
        path: 'products/:id',
        component: ProductDetailPage,
      },
    ],
  },
];
