import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
import { ConfigTarifaService } from '../config-tarifa/config-tarifa.service';
import { UnidadeIntervalo } from '../entities/config-tarifa.entity';

/** Aceita formato antigo (ABC-1234) e Mercosul (ABC4D67); retorna em maiúsculas sem hífen. */
function normalizarPlaca(placa: string): string {
  return placa.replace(/\s/g, '').replace(/-/g, '').toUpperCase();
}

export interface EntradaDto {
  placa: string;
  marca?: string;
  modelo?: string;
  cor?: string;
}

export interface SaidaResult {
  registro: RegistroEstacionamento;
  tempoMinutos: number;
  valorCobrado: number;
}

@Injectable()
export class EstacionamentoService {
  constructor(
    @InjectRepository(RegistroEstacionamento)
    private repo: Repository<RegistroEstacionamento>,
    private configTarifa: ConfigTarifaService,
  ) {}

  async entrada(dto: EntradaDto): Promise<RegistroEstacionamento> {
    const placaNorm = normalizarPlaca(dto.placa);
    const emAberto = await this.repo.findOne({
      where: { placa: placaNorm, horarioSaida: IsNull() },
    });
    if (emAberto) {
      throw new BadRequestException(
        `Já existe registro em aberto para a placa ${dto.placa}.`,
      );
    }
    const reg = this.repo.create({
      placa: placaNorm,
      marca: dto.marca?.trim() || null,
      modelo: dto.modelo?.trim() || null,
      cor: dto.cor?.trim() || null,
      horarioEntrada: new Date(),
    } as DeepPartial<RegistroEstacionamento>);
    return this.repo.save(reg);
  }

  /** Converte intervalo (quantidade + unidade) para segundos */
  private intervaloEmSegundos(quantidade: number, unidade: UnidadeIntervalo): number {
    switch (unidade) {
      case UnidadeIntervalo.SEGUNDOS:
        return quantidade;
      case UnidadeIntervalo.MINUTOS:
        return quantidade * 60;
      case UnidadeIntervalo.HORAS:
        return quantidade * 3600;
      default:
        return quantidade;
    }
  }

  /**
   * Calcula valor com base no tempo real entre entrada e saída.
   * Valor = valorInicial + (ceil(tempoReal / intervalo)) * valorPorIntervalo
   */
  calcularValor(
    horarioEntrada: Date,
    horarioSaida: Date,
    valorInicial: number,
    intervaloQuantidade: number,
    intervaloUnidade: UnidadeIntervalo,
    valorPorIntervalo: number,
  ): { tempoSegundos: number; tempoMinutos: number; valorCobrado: number } {
    const tempoSegundos = (horarioSaida.getTime() - horarioEntrada.getTime()) / 1000;
    const intervaloSeg = this.intervaloEmSegundos(intervaloQuantidade, intervaloUnidade);
    const numIntervalos = Math.max(0, Math.ceil(tempoSegundos / intervaloSeg));
    const valorCobrado = Number(
      (Number(valorInicial) + numIntervalos * Number(valorPorIntervalo)).toFixed(2),
    );
    return {
      tempoSegundos,
      tempoMinutos: Math.round((tempoSegundos / 60) * 100) / 100,
      valorCobrado,
    };
  }

  async saida(id: number): Promise<SaidaResult> {
    const registro = await this.repo.findOne({ where: { id } });
    if (!registro) throw new NotFoundException('Registro não encontrado.');
    if (registro.horarioSaida) {
      throw new BadRequestException('Saída já registrada para este veículo.');
    }
    const config = await this.configTarifa.getAtiva();
    const horarioSaida = new Date();
    const { tempoMinutos, valorCobrado } = this.calcularValor(
      registro.horarioEntrada,
      horarioSaida,
      Number(config.valorInicial),
      config.intervaloQuantidade,
      config.intervaloUnidade,
      Number(config.valorPorIntervalo),
    );
    registro.horarioSaida = horarioSaida;
    registro.valorCobrado = valorCobrado;
    await this.repo.save(registro);
    return { registro, tempoMinutos, valorCobrado };
  }

  async saidaPorPlaca(placa: string): Promise<SaidaResult> {
    const registro = await this.repo.findOne({
      where: { placa: normalizarPlaca(placa), horarioSaida: IsNull() },
    });
    if (!registro) {
      throw new NotFoundException(
        `Nenhum registro em aberto para a placa ${placa}.`,
      );
    }
    return this.saida(registro.id);
  }

  async listarEmAberto(): Promise<RegistroEstacionamento[]> {
    return this.repo.find({
      where: { horarioSaida: IsNull() },
      order: { horarioEntrada: 'DESC' },
    });
  }

  async listarTodos(filtro?: {
    placa?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<RegistroEstacionamento[]> {
    const qb = this.repo
      .createQueryBuilder('r')
      .orderBy('r.horario_entrada', 'DESC');
    if (filtro?.placa) {
      qb.andWhere('r.placa LIKE :placa', { placa: `%${filtro.placa}%` });
    }
    if (filtro?.dataInicio) {
      qb.andWhere('r.horario_entrada >= :dataInicio', {
        dataInicio: filtro.dataInicio,
      });
    }
    if (filtro?.dataFim) {
      qb.andWhere('r.horario_entrada <= :dataFim', { dataFim: filtro.dataFim });
    }
    return qb.getMany();
  }

  /** Registros já encerrados (com horario_saida), paginado, com filtro por placa e data (da saída). */
  async listarEncerrados(filtro: {
    page?: number;
    pageSize?: number;
    placa?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{ data: RegistroEstacionamento[]; total: number }> {
    const page = Math.max(1, filtro.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filtro.pageSize ?? 10));
    const skip = (page - 1) * pageSize;

    const qb = this.repo
      .createQueryBuilder('r')
      .where('r.horario_saida IS NOT NULL')
      .orderBy('r.horario_saida', 'DESC');

    if (filtro?.placa?.trim()) {
      qb.andWhere('r.placa LIKE :placa', { placa: `%${filtro.placa.trim()}%` });
    }
    if (filtro?.dataInicio) {
      qb.andWhere('r.horario_saida >= :dataInicio', {
        dataInicio: filtro.dataInicio,
      });
    }
    if (filtro?.dataFim) {
      qb.andWhere('r.horario_saida <= :dataFim', { dataFim: filtro.dataFim });
    }

    const [data, total] = await qb.skip(skip).take(pageSize).getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<RegistroEstacionamento> {
    const reg = await this.repo.findOne({ where: { id } });
    if (!reg) throw new NotFoundException('Registro não encontrado.');
    return reg;
  }
}
