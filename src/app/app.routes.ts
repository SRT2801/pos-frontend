import { Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login';
import { RegisterPage } from './modules/pages/register/register';
import { Layout } from './modules/shared/layout/layout';
import { Home } from './modules/pages/home/home';

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
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
    ],
  },
];
