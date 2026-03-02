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

/** Valor armazenado em senhaHash quando o funcionário ainda não definiu senha (primeiro acesso). */
export const PRIMEIRO_ACESSO_SENHA = '__PRIMEIRO_ACESSO__';

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

  @Column({ type: 'text', length: 20, nullable: true })
  telefone: string | null;

  @Column({ type: 'text', nullable: true })
  endereco: string | null;

  @Column({ type: 'text', enum: PerfilUsuario })
  perfil: PerfilUsuario;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
