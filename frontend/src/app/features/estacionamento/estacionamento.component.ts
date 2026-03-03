import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { interval, Subscription } from 'rxjs';
import {
  opcoesCores,
  opcoesMarcas,
  opcoesModelosPorMarca,
} from './estacionamento-dados';

interface RegistroEstacionamento {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  horarioEntrada: string;
  horarioSaida: string | null;
  valorCobrado: number | null;
}

interface SaidaResult {
  registro: RegistroEstacionamento;
  tempoMinutos: number;
  valorCobrado: number;
}

type UnidadeIntervalo = 'SEGUNDOS' | 'MINUTOS' | 'HORAS';

interface ConfigTarifa {
  id: number;
  valorInicial: number;
  intervaloQuantidade: number;
  intervaloUnidade: UnidadeIntervalo;
  valorPorIntervalo: number;
  vagasTotais?: number;
  ativo: boolean;
}

@Component({
  selector: 'app-estacionamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
  ],
  templateUrl: './estacionamento.component.html',
  styleUrl: './estacionamento.component.scss',
})
export class EstacionamentoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  /** Formato antigo: ABC-1234. Mercosul: ABC4D67. */
  private placaPattern = /^([A-Za-z]{3}-?\d{4}|[A-Za-z]{3}\d[A-Za-z]\d{2})$/;

  formEntrada = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(this.placaPattern)]],
    marca: ['', [Validators.maxLength(80)]],
    modelo: ['', [Validators.maxLength(80)]],
    cor: ['', [Validators.maxLength(40)]],
  });
  dataSource = new MatTableDataSource<RegistroEstacionamento>([]);
  displayedColumns: string[] = ['placa', 'marcaModelo', 'cor', 'entrada', 'valorAtual', 'acoes'];
  carregando = false;
  loadingEntrada = false;
  loadingSaida: number | null = null;
  msgEntrada = '';
  erroEntrada = false;
  resultadoSaida: SaidaResult | null = null;

  /** Atualizado a cada 2s para recalcular o valor em tempo real na tabela */
  private tick = signal(0);
  private configTarifa: ConfigTarifa | null = null;
  private intervalSub: Subscription | null = null;

  get emAberto(): RegistroEstacionamento[] {
    return this.dataSource.data;
  }

  get vagasTotais(): number {
    return this.configTarifa?.vagasTotais ?? 0;
  }

  get vagasOcupadas(): number {
    return this.emAberto.length;
  }

  get vagasDisponiveis(): number {
    return Math.max(0, this.vagasTotais - this.vagasOcupadas);
  }

  /** Opções de cor filtradas pelo texto digitado (autocomplete). */
  get opcoesCorFiltradas(): string[] {
    const v = (this.formEntrada.get('cor')?.value ?? '').toString().trim().toLowerCase();
    return v ? opcoesCores.filter((c) => c.toLowerCase().includes(v)) : opcoesCores;
  }

  /** Opções de marca filtradas pelo texto digitado (autocomplete). */
  get opcoesMarcaFiltradas(): string[] {
    const v = (this.formEntrada.get('marca')?.value ?? '').toString().trim().toLowerCase();
    const list = opcoesMarcas();
    return v ? list.filter((m) => m.toLowerCase().includes(v)) : list;
  }

  /** Opções de modelo conforme a marca selecionada, filtradas pelo texto (autocomplete). */
  get opcoesModeloFiltradas(): string[] {
    const marca = (this.formEntrada.get('marca')?.value ?? '').toString().trim();
    const v = (this.formEntrada.get('modelo')?.value ?? '').toString().trim().toLowerCase();
    const list = opcoesModelosPorMarca(marca);
    return v ? list.filter((m) => m.toLowerCase().includes(v)) : list;
  }

  displayMarca = (v: string | null): string => (v ?? '').toString();
  displayModelo = (v: string | null): string => (v ?? '').toString();
  displayCor = (v: string | null): string => (v ?? '').toString();

  ngOnInit(): void {
    this.carregarConfigTarifa();
    this.carregarEmAberto();
    this.intervalSub = interval(2000).subscribe(() => this.tick.update((v) => v + 1));
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
  }

  private carregarConfigTarifa(): void {
    this.http.get<ConfigTarifa>('/api/config-tarifa/ativa').subscribe({
      next: (c) => (this.configTarifa = c),
      error: () => (this.configTarifa = null),
    });
  }

  private intervaloEmSegundos(quantidade: number, unidade: UnidadeIntervalo): number {
    switch (unidade) {
      case 'SEGUNDOS':
        return quantidade;
      case 'MINUTOS':
        return quantidade * 60;
      case 'HORAS':
        return quantidade * 3600;
      default:
        return quantidade;
    }
  }

  /** Valor atual do estacionamento (atualizado a cada 2s via tick). */
  getValorAtual(row: RegistroEstacionamento): string {
    this.tick(); // dependência do signal para reexecutar a cada 2s
    if (!this.configTarifa) return '–';
    const entrada = new Date(row.horarioEntrada).getTime();
    const agora = Date.now();
    const tempoSegundos = (agora - entrada) / 1000;
    const intervaloSeg = this.intervaloEmSegundos(
      this.configTarifa.intervaloQuantidade,
      this.configTarifa.intervaloUnidade,
    );
    const numIntervalos = Math.max(0, Math.ceil(tempoSegundos / intervaloSeg));
    const valor =
      Number(this.configTarifa.valorInicial) +
      numIntervalos * Number(this.configTarifa.valorPorIntervalo);
    return 'R$ ' + valor.toFixed(2);
  }

  carregarEmAberto(): void {
    this.carregando = true;
    this.http.get<RegistroEstacionamento[]>('/api/estacionamento/em-aberto').subscribe({
      next: (list) => {
        this.dataSource.data = [...list];
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  formatarData(s: string): string {
    if (!s) return '-';
    const d = new Date(s);
    return d.toLocaleString('pt-BR');
  }

  /** Exibe tempo em minutos; a partir de 1h (60 min) exibe em horas. */
  formatarTempoExibicao(tempoMinutos: number): string {
    const min = Number(tempoMinutos);
    if (min >= 60) {
      const h = (min / 60).toFixed(2).replace('.', ',');
      return h + ' h';
    }
    const m = min.toFixed(2).replace('.', ',');
    return m + ' min';
  }

  registrarEntrada(): void {
    if (this.formEntrada.invalid) return;
    this.loadingEntrada = true;
    this.msgEntrada = '';
    this.erroEntrada = false;
    this.http.post<RegistroEstacionamento>('/api/estacionamento/entrada', this.formEntrada.value).subscribe({
      next: () => {
        this.formEntrada.reset();
        this.loadingEntrada = false;
        this.msgEntrada = 'Entrada registrada com sucesso.';
        this.carregarEmAberto();
      },
      error: (err) => {
        this.loadingEntrada = false;
        this.msgEntrada = err.error?.message || 'Erro ao registrar entrada.';
        this.erroEntrada = true;
      },
    });
  }

  registrarSaida(id: number): void {
    this.loadingSaida = id;
    this.resultadoSaida = null;
    this.http.post<SaidaResult>(`/api/estacionamento/saida/${id}`, {}).subscribe({
      next: (res) => {
        this.loadingSaida = null;
        this.resultadoSaida = res;
        // Remove da lista na hora
        this.dataSource.data = this.dataSource.data.filter((r) => r.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingSaida = null;
        // Saída já registrada ou outro erro: recarrega a lista do servidor
        this.carregarEmAberto();
      },
    });
  }

  /** Abre a janela de impressão com cupom formatado para impressora térmica (80mm). */
  imprimirCupom(): void {
    if (!this.resultadoSaida) return;
    const r = this.resultadoSaida.registro;
    const entrada = r.horarioEntrada ? this.formatarData(r.horarioEntrada) : '–';
    const saida = r.horarioSaida ? this.formatarData(r.horarioSaida) : '–';
    const marca = r.marca || '–';
    const modelo = r.modelo || '–';
    const cor = r.cor || '–';
    const tempo = this.formatarTempoExibicao(this.resultadoSaida.tempoMinutos);
    const valor = this.resultadoSaida.valorCobrado.toFixed(2).replace('.', ',');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cupom Estacionamento</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 12px; padding: 8px; width: 80mm; }
    h1 { font-size: 14px; text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 6px; }
    .linha { margin: 4px 0; }
    .destaque { font-weight: bold; }
    .centro { text-align: center; margin-top: 12px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <h1>ESTACIONAMENTO</h1>
  <div class="linha"><strong>Placa:</strong> ${r.placa}</div>
  <div class="linha"><strong>Marca:</strong> ${marca}</div>
  <div class="linha"><strong>Modelo:</strong> ${modelo}</div>
  <div class="linha"><strong>Cor:</strong> ${cor}</div>
  <div class="linha"><strong>Entrada:</strong> ${entrada}</div>
  <div class="linha"><strong>Saída:</strong> ${saida}</div>
  <div class="linha"><strong>Tempo:</strong> ${tempo}</div>
  <div class="linha destaque centro"><strong>VALOR TOTAL: R$ ${valor}</strong></div>
  <p class="centro" style="margin-top: 14px; font-size: 10px;">Obrigado. Volte sempre.</p>
</body>
</html>`;

    const janela = window.open('', '_blank', 'width=320,height=480');
    if (!janela) {
      alert('Permita pop-ups para imprimir o cupom.');
      return;
    }
    janela.document.write(html);
    janela.document.close();
    janela.focus();
    janela.onafterprint = () => janela.close();
    janela.print();
  }
}
