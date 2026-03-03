import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UnidadeIntervalo {
  SEGUNDOS = 'SEGUNDOS',
  MINUTOS = 'MINUTOS',
  HORAS = 'HORAS',
}

@Entity('config_tarifa')
export class ConfigTarifa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'valor_inicial' })
  valorInicial: number;

  /** Quantidade de tempo (ex: 20 segundos, 1 minuto, 1 hora) */
  @Column({ type: 'int', name: 'intervalo_quantidade' })
  intervaloQuantidade: number;

  @Column({
    type: 'text',
    enum: UnidadeIntervalo,
    name: 'intervalo_unidade',
  })
  intervaloUnidade: UnidadeIntervalo;

  /** Valor em R$ acrescentado a cada intervalo */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'valor_por_intervalo',
  })
  valorPorIntervalo: number;

  /** Quantidade total de vagas do estacionamento (configurável pelo gerente). */
  @Column({ type: 'int', name: 'vagas_totais', default: 0 })
  vagasTotais: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
