import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService, LoginDto, LoginResponse } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../entities/user.entity';

class LoginBodyDto implements LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}

class DefinirSenhaBodyDto {
  @IsString()
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres.' })
  novaSenha: string;
}

interface RequestComUser extends Request {
  user?: User;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginBodyDto): Promise<LoginResponse> {
    return this.auth.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: RequestComUser): Promise<{ id: number; email: string; nome: string; perfil: string; primeiroAcesso: boolean }> {
    return this.auth.me(req.user!.id);
  }

  @Post('definir-senha')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async definirSenha(@Req() req: RequestComUser, @Body() body: DefinirSenhaBodyDto): Promise<{ message: string }> {
    await this.auth.definirSenha(req.user!.id, body.novaSenha);
    return { message: 'Senha definida com sucesso.' };
  }
}
