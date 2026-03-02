import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, lastValueFrom } from 'rxjs';

export type PerfilUsuario = 'GERENTE' | 'FUNCIONARIO';

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  perfil: PerfilUsuario;
}

export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
  primeiroAcesso?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'usuario';

  private token = signal<string | null>(this.getStoredToken());
  private usuario = signal<Usuario | null>(this.getStoredUsuario());
  private primeiroAcesso = signal<boolean>(false);

  usuarioAtual = this.usuario.asReadonly();
  isLoggedIn = computed(() => !!this.token());
  precisaDefinirSenha = this.primeiroAcesso.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { email, senha })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
          this.token.set(res.access_token);
          this.usuario.set(res.usuario);
          if (res.primeiroAcesso) this.primeiroAcesso.set(true);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.usuario.set(null);
    this.primeiroAcesso.set(false);
    this.router.navigate(['/login']);
  }

  /** Carrega usuário e flag de primeiro acesso a partir do servidor (uso no APP_INITIALIZER). */
  loadSession(): Promise<void> {
    if (!this.getToken()) return Promise.resolve();
    return lastValueFrom(
      this.http.get<Usuario & { primeiroAcesso: boolean }>('/api/auth/me').pipe(
        tap((res) => {
          this.usuario.set({ id: res.id, email: res.email, nome: res.nome, perfil: res.perfil });
          this.primeiroAcesso.set(res.primeiroAcesso);
        }),
      ),
    ).then(
      () => {},
      () => {
        this.logout();
      },
    );
  }

  definirSenha(novaSenha: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/definir-senha', { novaSenha }).pipe(
      tap(() => this.primeiroAcesso.set(false)),
    );
  }

  getToken(): string | null {
    return this.token();
  }

  isGerente(): boolean {
    return this.usuario()?.perfil === 'GERENTE';
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUsuario(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }
}
