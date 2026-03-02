"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const config_tarifa_entity_1 = require("../entities/config-tarifa.entity");
const config_tarifa_entity_2 = require("../entities/config-tarifa.entity");
let SeedService = class SeedService {
    constructor(userRepo, configRepo) {
        this.userRepo = userRepo;
        this.configRepo = configRepo;
    }
    async onModuleInit() {
        await this.seedUsers();
        await this.seedConfigTarifa();
    }
    async seedUsers() {
        const count = await this.userRepo.count();
        if (count > 0)
            return;
        const hash = await bcrypt.hash('123456', 10);
        await this.userRepo.save([
            this.userRepo.create({
                email: 'gerente@estacionamento.com',
                senhaHash: hash,
                nome: 'Gerente',
                perfil: user_entity_1.PerfilUsuario.GERENTE,
                ativo: true,
            }),
            this.userRepo.create({
                email: 'funcionario@estacionamento.com',
                senhaHash: hash,
                nome: 'Funcionário',
                perfil: user_entity_1.PerfilUsuario.FUNCIONARIO,
                ativo: true,
            }),
        ]);
        console.log('Seed: usuários criados (gerente@estacionamento.com / funcionario@estacionamento.com, senha: 123456)');
    }
    async seedConfigTarifa() {
        const count = await this.configRepo.count();
        if (count > 0)
            return;
        await this.configRepo.save(this.configRepo.create({
            valorInicial: 8,
            intervaloQuantidade: 20,
            intervaloUnidade: config_tarifa_entity_2.UnidadeIntervalo.SEGUNDOS,
            valorPorIntervalo: 0.3,
            ativo: true,
        }));
        console.log('Seed: configuração de tarifa padrão criada (R$ 8,00 + R$ 0,30 a cada 20 segundos)');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(config_tarifa_entity_1.ConfigTarifa)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map