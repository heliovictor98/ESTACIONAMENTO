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

  @Column({ type: 'text', nullable: true })
  marca: string;

  @Column({ type: 'text', nullable: true })
  modelo: string;

  @Column({ type: 'text', nullable: true })
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
