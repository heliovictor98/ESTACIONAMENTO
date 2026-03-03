import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface RegistroEncerrado {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  horarioEntrada: string;
  horarioSaida: string | null;
  valorCobrado: number | null;
}

interface EncerradosResponse {
  data: RegistroEncerrado[];
  total: number;
}

@Component({
  selector: 'app-historico',
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
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss',
})
export class HistoricoComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  formFiltro = this.fb.group({
    placa: [''],
    dataInicio: [''],
    dataFim: [''],
  });

  dataSource = new MatTableDataSource<RegistroEncerrado>([]);
  displayedColumns: string[] = ['placa', 'marcaModelo', 'cor', 'entrada', 'saida', 'valor', 'acoes'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    const placa = this.formFiltro.get('placa')?.value?.trim() ?? '';
    const dataInicio = this.formFiltro.get('dataInicio')?.value ?? '';
    const dataFim = this.formFiltro.get('dataFim')?.value ?? '';
    let params = new HttpParams()
      .set('page', String(this.pageIndex + 1))
      .set('pageSize', String(this.pageSize));
    if (placa) params = params.set('placa', placa);
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);

    this.http.get<EncerradosResponse>('/api/estacionamento/encerrados', { params }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  aplicarFiltros(): void {
    this.pageIndex = 0;
    if (this.paginator) this.paginator.pageIndex = 0;
    this.carregar();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregar();
  }

  formatarData(s: string | null): string {
    if (!s) return '–';
    return new Date(s).toLocaleString('pt-BR');
  }

  formatarValor(v: number | null): string {
    if (v == null) return '–';
    return 'R$ ' + Number(v).toFixed(2);
  }

  marcaModelo(r: RegistroEncerrado): string {
    if (r.marca && r.modelo) return r.marca + ' / ' + r.modelo;
    return r.marca || r.modelo || '–';
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

  imprimirCupom(r: RegistroEncerrado): void {
    const entrada = r.horarioEntrada ? this.formatarData(r.horarioEntrada) : '–';
    const saida = r.horarioSaida ? this.formatarData(r.horarioSaida) : '–';
    const marca = r.marca || '–';
    const modelo = r.modelo || '–';
    const cor = r.cor || '–';
    const valor = (r.valorCobrado ?? 0).toFixed(2).replace('.', ',');
    const saidaMs = r.horarioSaida ? new Date(r.horarioSaida).getTime() : 0;
    const entradaMs = new Date(r.horarioEntrada).getTime();
    const tempoMinutos = (saidaMs - entradaMs) / 60000;
    const tempo = this.formatarTempoExibicao(tempoMinutos);

    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cupom</title><style>*{margin:0;padding:0}body{font-family:\'Courier New\',monospace;font-size:12px;padding:8px;width:80mm}h1{font-size:14px;text-align:center;margin-bottom:10px;border-bottom:1px dashed #000;padding-bottom:6px}.linha{margin:4px 0}.destaque{font-weight:bold}.centro{text-align:center;margin-top:12px}</style></head><body><h1>ESTACIONAMENTO</h1><div class="linha"><strong>Placa:</strong> ' + r.placa + '</div><div class="linha"><strong>Marca:</strong> ' + marca + '</div><div class="linha"><strong>Modelo:</strong> ' + modelo + '</div><div class="linha"><strong>Cor:</strong> ' + cor + '</div><div class="linha"><strong>Entrada:</strong> ' + entrada + '</div><div class="linha"><strong>Saída:</strong> ' + saida + '</div><div class="linha"><strong>Tempo:</strong> ' + tempo + '</div><div class="linha destaque centro"><strong>VALOR TOTAL: R$ ' + valor + '</strong></div><p class="centro" style="margin-top:14px;font-size:10px">Obrigado. Volte sempre.</p></body></html>';

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
