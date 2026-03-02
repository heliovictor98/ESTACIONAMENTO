import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FuncionariosService } from '../funcionarios.service';

export interface ResetSenhaDialogData {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-reset-senha-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Redefinir senha</h2>
    <mat-dialog-content>
      <p>Nova senha para <strong>{{ data.nome }}</strong></p>
      <form [formGroup]="form" id="resetForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nova senha</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" formControlName="novaSenha" />
          <mat-hint>Mínimo 4 caracteres</mat-hint>
          <mat-error>Mínimo 4 caracteres</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar senha</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" formControlName="confirmar" />
          <mat-error>As senhas não coincidem</mat-error>
        </mat-form-field>
      </form>
      @if (erro) {
        <p class="erro">{{ erro }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">Cancelar</button>
      <button mat-flat-button color="primary" type="submit" form="resetForm" (click)="salvar()" [disabled]="form.invalid || loading">
        Redefinir
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width { width: 100%; display: block; margin-bottom: 0.5rem; }
      .erro { color: #c62828; font-size: 0.875rem; margin: 0.5rem 0; }
      mat-dialog-content { min-width: 280px; }
    `,
  ],
})
export class ResetSenhaDialogComponent {
  private fb = inject(FormBuilder);
  private service = inject(FuncionariosService);
  private ref = inject(MatDialogRef<ResetSenhaDialogComponent>);
  data = inject<ResetSenhaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(4)]],
    confirmar: ['', [Validators.required]],
  });
  hide = true;
  loading = false;
  erro = '';

  salvar(): void {
    if (this.form.invalid) return;
    const nova = this.form.value.novaSenha!;
    const conf = this.form.value.confirmar!;
    if (nova !== conf) {
      this.erro = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    this.erro = '';
    this.service.resetarSenha(this.data.id, nova).subscribe({
      next: () => this.ref.close(true),
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.message || 'Erro ao redefinir senha.';
      },
    });
  }
}
