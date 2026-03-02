import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FuncionariosService, CreateFuncionarioDto, UpdateFuncionarioDto } from './funcionarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PerfilUsuario } from '../entities/user.entity';
import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

class CreateFuncionarioBodyDto implements CreateFuncionarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(PerfilUsuario)
  perfil?: PerfilUsuario;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;
}

class UpdateFuncionarioBodyDto implements UpdateFuncionarioDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(PerfilUsuario)
  perfil?: PerfilUsuario;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  ativo?: boolean;
}

class ResetSenhaBodyDto {
  @IsString()
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres.' })
  novaSenha: string;
}

@Controller('funcionarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PerfilUsuario.GERENTE)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class FuncionariosController {
  constructor(private service: FuncionariosService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: CreateFuncionarioBodyDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFuncionarioBodyDto,
  ) {
    return this.service.update(id, body);
  }

  @Patch(':id/desativar')
  desativar(@Param('id', ParseIntPipe) id: number) {
    return this.service.desativar(id);
  }

  @Patch(':id/reativar')
  reativar(@Param('id', ParseIntPipe) id: number) {
    return this.service.reativar(id);
  }

  @Post(':id/reset-senha')
  resetarSenha(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResetSenhaBodyDto,
  ): Promise<{ message: string }> {
    return this.service.resetarSenha(id, body.novaSenha).then(() => ({ message: 'Senha alterada com sucesso.' }));
  }
}
