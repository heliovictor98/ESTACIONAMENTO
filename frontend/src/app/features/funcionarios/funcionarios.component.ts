import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuncionariosService, Funcionario } from './funcionarios.service';
import { FuncionarioFormDialogComponent } from './funcionario-form-dialog/funcionario-form-dialog.component';
import { ResetSenhaDialogComponent } from './reset-senha-dialog/reset-senha-dialog.component';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss',
})
export class FuncionariosComponent implements OnInit {
  private service = inject(FuncionariosService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  list: Funcionario[] = [];
  loading = false;
  msg = '';
  erro = false;
  displayedColumns = ['nome', 'email', 'perfil', 'telefone', 'endereco', 'ativo', 'acoes'];

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.service.list().subscribe({
      next: (data) => {
        this.list = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.msg = 'Erro ao carregar funcionários.';
        this.erro = true;
      },
    });
  }

  novoFuncionario(): void {
    const ref = this.dialog.open(FuncionarioFormDialogComponent, {
      width: '420px',
      data: {},
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.snackBar.open('Funcionário cadastrado. No primeiro acesso, deixe a senha em branco.', undefined, { duration: 4000 });
        this.carregar();
      }
    });
  }

  editar(f: Funcionario): void {
    const ref = this.dialog.open(FuncionarioFormDialogComponent, {
      width: '420px',
      data: { funcionario: f },
    });
    ref.afterClosed().subscribe((atualizou) => {
      if (atualizou) this.carregar();
    });
  }

  desativar(f: Funcionario): void {
    if (!confirm(`Desativar ${f.nome}? Ele não poderá mais fazer login.`)) return;
    this.service.desativar(f.id).subscribe({
      next: () => {
        this.snackBar.open('Funcionário desativado.', undefined, { duration: 3000 });
        this.carregar();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao desativar.', undefined, { duration: 4000 }),
    });
  }

  reativar(f: Funcionario): void {
    this.service.reativar(f.id).subscribe({
      next: () => {
        this.snackBar.open('Funcionário reativado.', undefined, { duration: 3000 });
        this.carregar();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao reativar.', undefined, { duration: 4000 }),
    });
  }

  redefinirSenha(f: Funcionario): void {
    const ref = this.dialog.open(ResetSenhaDialogComponent, {
      width: '360px',
      data: { id: f.id, nome: f.nome },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.snackBar.open('Senha alterada com sucesso.', undefined, { duration: 3000 });
    });
  }
}
