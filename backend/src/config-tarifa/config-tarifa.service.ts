import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConfigTarifa,
  UnidadeIntervalo,
} from '../entities/config-tarifa.entity';

export interface UpdateConfigTarifaDto {
  valorInicial?: number;
  intervaloQuantidade?: number;
  intervaloUnidade?: UnidadeIntervalo;
  valorPorIntervalo?: number;
  vagasTotais?: number;
}

@Injectable()
export class ConfigTarifaService {
  constructor(
    @InjectRepository(ConfigTarifa)
    private repo: Repository<ConfigTarifa>,
  ) {}

  async getAtiva(): Promise<ConfigTarifa> {
    const config = await this.repo.findOne({ where: { ativo: true } });
    if (!config) throw new NotFoundException('Nenhuma configuração de tarifa ativa.');
    return config;
  }

  async findAll(): Promise<ConfigTarifa[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async update(id: number, dto: UpdateConfigTarifaDto): Promise<ConfigTarifa> {
    const config = await this.repo.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuração não encontrada.');
    Object.assign(config, dto);
    return this.repo.save(config);
  }

  private async desativarTodas(): Promise<void> {
    const ativas = await this.repo.find({ where: { ativo: true } });
    for (const c of ativas) {
      c.ativo = false;
    }
    if (ativas.length > 0) await this.repo.save(ativas);
  }

  async create(dto: {
    valorInicial: number;
    intervaloQuantidade: number;
    intervaloUnidade: UnidadeIntervalo;
    valorPorIntervalo: number;
    vagasTotais?: number;
  }): Promise<ConfigTarifa> {
    await this.desativarTodas();
    let vagasTotais = dto.vagasTotais;
    if (vagasTotais == null) {
      const ativa = await this.repo.findOne({ where: { ativo: true } });
      vagasTotais = ativa?.vagasTotais ?? 0;
    }
    const config = this.repo.create({ ...dto, vagasTotais, ativo: true });
    return this.repo.save(config);
  }

  async setAtiva(id: number): Promise<ConfigTarifa> {
    await this.desativarTodas();
    const config = await this.repo.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuração não encontrada.');
    config.ativo = true;
    return this.repo.save(config);
  }
}
