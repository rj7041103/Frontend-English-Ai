import { Routes } from '@angular/router';
import { AuthGuard } from '../pages/Auth/guards/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/Auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/Auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'session',
    loadComponent: () =>
      import('../pages/ia/ia.component').then((c) => c.IAComponent),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('../pages/aplication/aplication.component').then(
        (c) => c.AplicationComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('../pages/chat/chat.component').then((c) => c.ChatComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'practices',
    loadComponent: () =>
      import('../pages/practices/practices.component').then(
        (c) => c.PracticesComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../pages/no-found/no-found.component').then(
        (c) => c.NoFoundComponent
      ),
  },
];
