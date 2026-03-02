import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { definirSenhaGuard } from './core/guards/definir-senha.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'definir-senha',
    canActivate: [authGuard],
    loadComponent: () => import('./features/definir-senha/definir-senha.component').then(m => m.DefinirSenhaComponent),
  },
  {
    path: '',
    canActivate: [authGuard, definirSenhaGuard],
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'estacionamento', pathMatch: 'full' },
      {
        path: 'estacionamento',
        loadComponent: () => import('./features/estacionamento/estacionamento.component').then(m => m.EstacionamentoComponent),
      },
      {
        path: 'config-tarifa',
        canActivate: [roleGuard(['GERENTE'])],
        loadComponent: () => import('./features/config-tarifa/config-tarifa.component').then(m => m.ConfigTarifaComponent),
      },
      {
        path: 'funcionarios',
        canActivate: [roleGuard(['GERENTE'])],
        loadComponent: () => import('./features/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
