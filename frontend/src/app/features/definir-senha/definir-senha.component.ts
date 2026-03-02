import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-definir-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './definir-senha.component.html',
  styleUrl: './definir-senha.component.scss',
})
export class DefinirSenhaComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(4)]],
    confirmar: ['', [Validators.required]],
  });
  loading = false;
  erro = '';
  hidePassword = true;
  hideConfirm = true;

  onSubmit(): void {
    if (this.form.invalid) return;
    const nova = this.form.value.novaSenha!;
    const conf = this.form.value.confirmar!;
    if (nova !== conf) {
      this.erro = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    this.erro = '';
    this.auth.definirSenha(nova).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.message || 'Erro ao definir senha. Tente novamente.';
      },
    });
  }
}
