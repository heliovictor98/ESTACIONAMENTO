import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type UnidadeIntervalo = 'SEGUNDOS' | 'MINUTOS' | 'HORAS';

interface ConfigTarifa {
  id: number;
  valorInicial: number;
  intervaloQuantidade: number;
  intervaloUnidade: UnidadeIntervalo;
  valorPorIntervalo: number;
  ativo: boolean;
}

@Component({
  selector: 'app-config-tarifa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './config-tarifa.component.html',
  styleUrl: './config-tarifa.component.scss',
})
export class ConfigTarifaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form = this.fb.group({
    valorInicial: [8, [Validators.required, Validators.min(0)]],
    intervaloQuantidade: [20, [Validators.required, Validators.min(1)]],
    intervaloUnidade: ['SEGUNDOS' as UnidadeIntervalo, Validators.required],
    valorPorIntervalo: [0.3, [Validators.required, Validators.min(0)]],
  });
  configAtiva: ConfigTarifa | null = null;
  salvando = false;
  msg = '';
  erro = false;

  ngOnInit(): void {
    this.carregarAtiva();
  }

  labelUnidade(u: UnidadeIntervalo): string {
    return { SEGUNDOS: 'segundos', MINUTOS: 'minutos', HORAS: 'horas' }[u];
  }

  carregarAtiva(): void {
    this.http.get<ConfigTarifa>('/api/config-tarifa/ativa').subscribe({
      next: (c) => (this.configAtiva = c),
      error: () => (this.configAtiva = null),
    });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando = true;
    this.msg = '';
    this.erro = false;
    const body = this.form.value;
    this.http.post<ConfigTarifa>('/api/config-tarifa', body).subscribe({
      next: (c) => {
        this.configAtiva = c;
        this.salvando = false;
        this.msg = 'Configuração salva e ativada.';
      },
      error: (err) => {
        this.salvando = false;
        this.msg = err.error?.message || 'Erro ao salvar.';
        this.erro = true;
      },
    });
  }
}
