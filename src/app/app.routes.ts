import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage),
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
    canActivate: [GuestGuard]
  },
  {
    path: 'car-list',
    loadComponent: () => import('./car-list/car-list.page').then(m => m.CarListPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'car-create',
    loadComponent: () => import('./car-create/car-create.page').then(m => m.CarCreatePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'car-detail/:id',
    loadComponent: () => import('./car-detail/car-detail.page').then(m => m.CarDetailPage),
    canActivate: [AuthGuard]
  },
];
