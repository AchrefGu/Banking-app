import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'accounts',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/accounts/pages/accounts-list/accounts-list.component')
      .then(m => m.AccountsListComponent)
  },
  {
    path: 'transactions',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/transactions/pages/transactions/transactions.component')
      .then(m => m.TransactionsComponent)
  },
  {
    path: 'transactions/:accountId',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/transactions/pages/transactions/transactions.component')
      .then(m => m.TransactionsComponent)
  }, // <-- VERIFIEZ LA VIRGULE ICI !
  {
    path: 'admin/users',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/admin/pages/users/users.component')
      .then(m => m.UsersComponent)
  },
  {
    path: 'admin/accounts',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/admin/pages/accounts/accounts.component')
      .then(m => m.AccountsComponent)
  }, // <-- ET IGNez AUSSI
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];