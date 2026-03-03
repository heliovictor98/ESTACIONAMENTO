import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstacionamentoService, EntradaDto, SaidaResult } from './estacionamento.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

/** Formato antigo: ABC-1234. Mercosul: ABC4D67. */
const PLACA_BR_REGEX = /^[A-Za-z]{3}-?\d{4}$|^[A-Za-z]{3}\d[A-Za-z]\d{2}$/;

class EntradaBodyDto implements EntradaDto {
  @IsString()
  @Matches(PLACA_BR_REGEX, { message: 'Placa inválida. Use o formato antigo (ABC-1234) ou Mercosul (ABC4D67).' })
  placa: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  marca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  modelo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  cor?: string;
}

@Controller('estacionamento')
@UseGuards(JwtAuthGuard)
export class EstacionamentoController {
  constructor(private service: EstacionamentoService) {}

  @Post('entrada')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  entrada(@Body() body: EntradaBodyDto): Promise<RegistroEstacionamento> {
    return this.service.entrada(body);
  }

  @Post('saida/:id')
  saida(@Param('id', ParseIntPipe) id: number): Promise<SaidaResult> {
    return this.service.saida(id);
  }

  @Post('saida-placa/:placa')
  saidaPorPlaca(@Param('placa') placa: string): Promise<SaidaResult> {
    return this.service.saidaPorPlaca(placa);
  }

  @Get('em-aberto')
  listarEmAberto(): Promise<RegistroEstacionamento[]> {
    return this.service.listarEmAberto();
  }

  @Get('encerrados')
  listarEncerrados(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('placa') placa?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.service.listarEncerrados({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      placa,
      dataInicio,
      dataFim,
    });
  }

  @Get()
  listarTodos(
    @Query('placa') placa?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ): Promise<RegistroEstacionamento[]> {
    return this.service.listarTodos({ placa, dataInicio, dataFim });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RegistroEstacionamento> {
    return this.service.findOne(id);
  }
}
