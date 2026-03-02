import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TelefoneMaskDirective } from '../../../shared/telefone-mask.directive';
import { FuncionariosService, Funcionario, CreateFuncionarioDto, UpdateFuncionarioDto, PerfilUsuario } from '../funcionarios.service';

export interface FuncionarioFormDialogData {
  funcionario?: Funcionario | null;
}

@Component({
  selector: 'app-funcionario-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TelefoneMaskDirective,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdicao ? 'Editar funcionário' : 'Novo funcionário' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" id="editForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" />
          <mat-error>Informe o nome</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Login (e-mail)</mat-label>
          <input matInput type="email" formControlName="email" />
          <mat-error>E-mail inválido</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Perfil</mat-label>
          <mat-select formControlName="perfil">
            <mat-option value="GERENTE">Gerente</mat-option>
            <mat-option value="FUNCIONARIO">Funcionário</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="telefone" appTelefoneMask type="tel" placeholder="(00) 00000-0000" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Endereço</mat-label>
          <input matInput formControlName="endereco" />
        </mat-form-field>
      </form>
      @if (erro) {
        <p class="erro">{{ erro }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">Cancelar</button>
      <button mat-flat-button color="primary" type="submit" form="editForm" (click)="salvar()" [disabled]="form.invalid || loading">
        {{ isEdicao ? 'Salvar' : 'Cadastrar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width { width: 100%; display: block; margin-bottom: 0.5rem; }
      .erro { color: #c62828; font-size: 0.875rem; margin: 0.5rem 0; }
      mat-dialog-content { min-width: 320px; }
    `,
  ],
})
export class FuncionarioFormDialogComponent {
  private fb = inject(FormBuilder);
  private service = inject(FuncionariosService);
  private ref = inject(MatDialogRef<FuncionarioFormDialogComponent>);
  private data = inject<FuncionarioFormDialogData>(MAT_DIALOG_DATA);

  isEdicao = !!this.data.funcionario;

  form = this.fb.group({
    nome: [this.data.funcionario?.nome ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.data.funcionario?.email ?? '', [Validators.required, Validators.email]],
    perfil: [this.data.funcionario?.perfil ?? 'FUNCIONARIO', Validators.required],
    telefone: [this.data.funcionario?.telefone ?? ''],
    endereco: [this.data.funcionario?.endereco ?? ''],
  });
  loading = false;
  erro = '';

  salvar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.erro = '';
    if (this.isEdicao && this.data.funcionario) {
      const dto: UpdateFuncionarioDto = {
        nome: this.form.value.nome!,
        email: this.form.value.email!,
        perfil: (this.form.value.perfil as PerfilUsuario) ?? undefined,
        telefone: this.form.value.telefone || undefined,
        endereco: this.form.value.endereco || undefined,
      };
      this.service.update(this.data.funcionario.id, dto).subscribe({
        next: () => this.ref.close(true),
        error: (err) => {
          this.loading = false;
          this.erro = err.error?.message || 'Erro ao salvar.';
        },
      });
    } else {
      const dto: CreateFuncionarioDto = {
        nome: this.form.value.nome!,
        email: this.form.value.email!,
        perfil: (this.form.value.perfil as PerfilUsuario) ?? 'FUNCIONARIO',
        telefone: this.form.value.telefone || undefined,
        endereco: this.form.value.endereco || undefined,
      };
      this.service.create(dto).subscribe({
        next: () => this.ref.close(true),
        error: (err) => {
          this.loading = false;
          this.erro = err.error?.message || 'Erro ao cadastrar.';
        },
      });
    }
  }
}
