import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, PerfilUsuario, PRIMEIRO_ACESSO_SENHA } from '../entities/user.entity';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  perfil: PerfilUsuario;
}

export interface LoginResponse {
  access_token: string;
  usuario: { id: number; email: string; nome: string; perfil: PerfilUsuario };
  primeiroAcesso?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }
    if (!user.ativo) {
      throw new UnauthorizedException('Usuário desativado. Entre em contato com o gerente.');
    }

    const senhaEmBranco = dto.senha == null || String(dto.senha).trim() === '';
    const ehPrimeiroAcesso = user.senhaHash === PRIMEIRO_ACESSO_SENHA;

    if (ehPrimeiroAcesso) {
      if (!senhaEmBranco) {
        throw new UnauthorizedException('Primeiro acesso: deixe a senha em branco e clique em Entrar.');
      }
      const payload: JwtPayload = { sub: user.id, email: user.email, perfil: user.perfil };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        usuario: { id: user.id, email: user.email, nome: user.nome, perfil: user.perfil },
        primeiroAcesso: true,
      };
    }

    if (!(await bcrypt.compare(dto.senha, user.senhaHash))) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }
    const payload: JwtPayload = { sub: user.id, email: user.email, perfil: user.perfil };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      usuario: { id: user.id, email: user.email, nome: user.nome, perfil: user.perfil },
    };
  }

  async definirSenha(userId: number, novaSenha: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.senhaHash !== PRIMEIRO_ACESSO_SENHA) {
      throw new BadRequestException('Definição de senha não permitida para este usuário.');
    }
    user.senhaHash = await bcrypt.hash(novaSenha, 10);
    await this.userRepo.save(user);
  }

  async validateByPayload(payload: JwtPayload): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: payload.sub } });
  }

  async me(userId: number): Promise<LoginResponse['usuario'] & { primeiroAcesso: boolean }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');
    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
      primeiroAcesso: user.senhaHash === PRIMEIRO_ACESSO_SENHA,
    };
  }
}
