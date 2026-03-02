import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, PerfilUsuario, PRIMEIRO_ACESSO_SENHA } from '../entities/user.entity';

export interface CreateFuncionarioDto {
  nome: string;
  email: string;
  perfil?: PerfilUsuario;
  telefone?: string;
  endereco?: string;
}

export interface UpdateFuncionarioDto {
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
}

@Injectable()
export class FuncionariosService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private semSenha(u: User): Omit<User, 'senhaHash'> {
    const { senhaHash: _, ...rest } = u;
    return rest;
  }

  async findAll(): Promise<Omit<User, 'senhaHash'>[]> {
    const list = await this.userRepo.find({ order: { nome: 'ASC' } });
    return list.map((u) => this.semSenha(u));
  }

  async findOne(id: number): Promise<Omit<User, 'senhaHash'>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return this.semSenha(user);
  }

  async create(dto: CreateFuncionarioDto): Promise<Omit<User, 'senhaHash'>> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Já existe um usuário com este e-mail.');
    const user = this.userRepo.create({
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone ?? null,
      endereco: dto.endereco ?? null,
      perfil: dto.perfil ?? PerfilUsuario.FUNCIONARIO,
      senhaHash: PRIMEIRO_ACESSO_SENHA,
      ativo: true,
    });
    const saved = await this.userRepo.save(user);
    return this.semSenha(saved);
  }

  async update(id: number, dto: UpdateFuncionarioDto): Promise<Omit<User, 'senhaHash'>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (dto.email != null && dto.email !== user.email) {
      const exists = await this.userRepo.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Já existe um usuário com este e-mail.');
      user.email = dto.email;
    }
    if (dto.nome != null) user.nome = dto.nome;
    if (dto.perfil != null) user.perfil = dto.perfil;
    if (dto.telefone !== undefined) user.telefone = dto.telefone || null;
    if (dto.endereco !== undefined) user.endereco = dto.endereco || null;
    if (dto.ativo !== undefined) user.ativo = dto.ativo;
    const saved = await this.userRepo.save(user);
    return this.semSenha(saved);
  }

  async desativar(id: number): Promise<Omit<User, 'senhaHash'>> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    user.ativo = false;
    return this.semSenha(await this.userRepo.save(user));
  }

  async reativar(id: number): Promise<Omit<User, 'senhaHash'>> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    user.ativo = true;
    return this.semSenha(await this.userRepo.save(user));
  }

  async resetarSenha(id: number, novaSenha: string): Promise<void> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    user.senhaHash = await bcrypt.hash(novaSenha, 10);
    await this.userRepo.save(user);
  }
}
