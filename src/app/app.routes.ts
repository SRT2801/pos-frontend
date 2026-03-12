import { Routes } from '@angular/router';
import { LoginComponent } from './modules/pages/login/login';
import { RegisterComponent } from './modules/pages/register-component/register-component';
import { Layout } from './modules/shared/layout/layout';
import { Home } from './modules/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: '',
    component: Layout,
    children: [{ path: 'home', component: Home }],
  },
];
