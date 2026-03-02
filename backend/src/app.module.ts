import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigTarifa } from './entities/config-tarifa.entity';
import { RegistroEstacionamento } from './entities/registro-estacionamento.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigTarifaModule } from './config-tarifa/config-tarifa.module';
import { EstacionamentoModule } from './estacionamento/estacionamento.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'estacionamento.db',
      entities: [User, ConfigTarifa, RegistroEstacionamento],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, ConfigTarifa]),
    AuthModule,
    ConfigTarifaModule,
    EstacionamentoModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
