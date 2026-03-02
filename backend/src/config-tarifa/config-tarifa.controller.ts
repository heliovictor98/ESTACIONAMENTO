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
import { ConfigTarifaService, UpdateConfigTarifaDto } from './config-tarifa.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PerfilUsuario } from '../entities/user.entity';
import { ConfigTarifa, UnidadeIntervalo } from '../entities/config-tarifa.entity';
import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

class UpdateConfigTarifaBodyDto implements UpdateConfigTarifaDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorInicial?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  intervaloQuantidade?: number;

  @IsOptional()
  @IsEnum(UnidadeIntervalo)
  intervaloUnidade?: UnidadeIntervalo;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorPorIntervalo?: number;
}

class CreateConfigTarifaBodyDto {
  @IsNumber()
  @Min(0)
  valorInicial: number;

  @IsNumber()
  @Min(1)
  intervaloQuantidade: number;

  @IsEnum(UnidadeIntervalo)
  intervaloUnidade: UnidadeIntervalo;

  @IsNumber()
  @Min(0)
  valorPorIntervalo: number;
}

@Controller('config-tarifa')
@UseGuards(JwtAuthGuard)
export class ConfigTarifaController {
  constructor(private service: ConfigTarifaService) {}

  /** Qualquer usuário autenticado pode ver a config ativa (para exibir regras no front) */
  @Get('ativa')
  getAtiva(): Promise<ConfigTarifa> {
    return this.service.getAtiva();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.GERENTE)
  findAll(): Promise<ConfigTarifa[]> {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.GERENTE)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateConfigTarifaBodyDto): Promise<ConfigTarifa> {
    return this.service.create(body);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.GERENTE)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateConfigTarifaBodyDto,
  ): Promise<ConfigTarifa> {
    return this.service.update(id, body);
  }

  @Post(':id/ativar')
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.GERENTE)
  setAtiva(@Param('id', ParseIntPipe) id: number): Promise<ConfigTarifa> {
    return this.service.setAtiva(id);
  }
}
