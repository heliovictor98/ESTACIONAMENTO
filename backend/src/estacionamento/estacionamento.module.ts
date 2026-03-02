import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
import { ConfigTarifaModule } from '../config-tarifa/config-tarifa.module';
import { EstacionamentoService } from './estacionamento.service';
import { EstacionamentoController } from './estacionamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroEstacionamento]),
    ConfigTarifaModule,
  ],
  controllers: [EstacionamentoController],
  providers: [EstacionamentoService],
  exports: [EstacionamentoService],
})
export class EstacionamentoModule {}
