import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, PerfilUsuario } from '../entities/user.entity';

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
    if (!user || !(await bcrypt.compare(dto.senha, user.senhaHash))) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }
    const payload: JwtPayload = { sub: user.id, email: user.email, perfil: user.perfil };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      usuario: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        perfil: user.perfil,
      },
    };
  }

  async validateByPayload(payload: JwtPayload): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: payload.sub } });
  }
}
