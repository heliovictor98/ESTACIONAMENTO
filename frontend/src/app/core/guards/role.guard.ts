import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';
import { PerfilUsuario } from '../auth.service';

export function roleGuard(perfis: PerfilUsuario[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const usuario = auth.usuarioAtual();
    if (usuario && perfis.includes(usuario.perfil)) return true;
    router.navigate(['/']);
    return false;
  };
}
