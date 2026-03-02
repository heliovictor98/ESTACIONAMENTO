import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  perfil: string;
  ativo: boolean;
  createdAt: string;
}

export type PerfilUsuario = 'GERENTE' | 'FUNCIONARIO';

export interface CreateFuncionarioDto {
  nome: string;
  email: string;
  perfil?: PerfilUsuario;
  telefone?: string;
  endereco?: string;
}

export interface UpdateFuncionarioDto {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  constructor(private http: HttpClient) {}

  list(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>('/api/funcionarios');
  }

  get(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`/api/funcionarios/${id}`);
  }

  create(dto: CreateFuncionarioDto): Observable<Funcionario> {
    return this.http.post<Funcionario>('/api/funcionarios', dto);
  }

  update(id: number, dto: UpdateFuncionarioDto): Observable<Funcionario> {
    return this.http.patch<Funcionario>(`/api/funcionarios/${id}`, dto);
  }

  desativar(id: number): Observable<Funcionario> {
    return this.http.patch<Funcionario>(`/api/funcionarios/${id}/desativar`, {});
  }

  reativar(id: number): Observable<Funcionario> {
    return this.http.patch<Funcionario>(`/api/funcionarios/${id}/reativar`, {});
  }

  resetarSenha(id: number, novaSenha: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/api/funcionarios/${id}/reset-senha`, { novaSenha });
  }
}
