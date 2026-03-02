import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTarifa } from '../entities/config-tarifa.entity';
import { ConfigTarifaService } from './config-tarifa.service';
import { ConfigTarifaController } from './config-tarifa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigTarifa])],
  controllers: [ConfigTarifaController],
  providers: [ConfigTarifaService],
  exports: [ConfigTarifaService],
})
export class ConfigTarifaModule {}
