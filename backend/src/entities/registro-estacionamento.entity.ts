import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('registro_estacionamento')
export class RegistroEstacionamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  placa: string;

  @Column({ length: 80 })
  marca: string;

  @Column({ length: 80 })
  modelo: string;

  @Column({ length: 40 })
  cor: string;

  @Column({ type: 'datetime', name: 'horario_entrada' })
  horarioEntrada: Date;

  @Column({ type: 'datetime', name: 'horario_saida', nullable: true })
  horarioSaida: Date | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'valor_cobrado',
    nullable: true,
  })
  valorCobrado: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
