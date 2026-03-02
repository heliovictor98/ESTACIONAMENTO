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
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

class EntradaBodyDto implements EntradaDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  placa: string;

  @IsString()
  @MaxLength(80)
  marca: string;

  @IsString()
  @MaxLength(80)
  modelo: string;

  @IsString()
  @MaxLength(40)
  cor: string;
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
