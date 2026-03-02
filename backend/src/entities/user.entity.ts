import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum PerfilUsuario {
  GERENTE = 'GERENTE',
  FUNCIONARIO = 'FUNCIONARIO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'senha_hash', length: 255 })
  senhaHash: string;

  @Column({ length: 120 })
  nome: string;

  @Column({ type: 'text', enum: PerfilUsuario })
  perfil: PerfilUsuario;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
