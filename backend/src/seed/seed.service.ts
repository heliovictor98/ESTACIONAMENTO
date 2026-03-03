import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, PerfilUsuario } from '../entities/user.entity';
import { ConfigTarifa } from '../entities/config-tarifa.entity';
import { UnidadeIntervalo } from '../entities/config-tarifa.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ConfigTarifa)
    private configRepo: Repository<ConfigTarifa>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedConfigTarifa();
  }

  private async seedUsers() {
    const count = await this.userRepo.count();
    if (count > 0) return;
    const hash = await bcrypt.hash('123456', 10);
    await this.userRepo.save([
      this.userRepo.create({
        email: 'gerente@estacionamento.com',
        senhaHash: hash,
        nome: 'Gerente',
        perfil: PerfilUsuario.GERENTE,
        ativo: true,
      }),
      this.userRepo.create({
        email: 'funcionario@estacionamento.com',
        senhaHash: hash,
        nome: 'Funcionário',
        perfil: PerfilUsuario.FUNCIONARIO,
        ativo: true,
      }),
    ]);
    console.log('Seed: usuários criados (gerente@estacionamento.com / funcionario@estacionamento.com, senha: 123456)');
  }

  private async seedConfigTarifa() {
    const count = await this.configRepo.count();
    if (count > 0) return;
    await this.configRepo.save(
      this.configRepo.create({
        valorInicial: 8,
        intervaloQuantidade: 20,
        intervaloUnidade: UnidadeIntervalo.SEGUNDOS,
        valorPorIntervalo: 0.3,
        vagasTotais: 0,
        ativo: true,
      }),
    );
    console.log('Seed: configuração de tarifa padrão criada (R$ 8,00 + R$ 0,30 a cada 20 segundos)');
  }
}
