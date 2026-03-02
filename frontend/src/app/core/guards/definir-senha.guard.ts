import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';

/** Redireciona para /definir-senha se o usuário está em primeiro acesso (senha em branco). Usar na rota do layout. */
export const definirSenhaGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.precisaDefinirSenha()) return router.createUrlTree(['/definir-senha']);
  return true;
};
