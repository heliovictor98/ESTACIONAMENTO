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
exports.ConfigTarifaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_tarifa_entity_1 = require("../entities/config-tarifa.entity");
let ConfigTarifaService = class ConfigTarifaService {
    constructor(repo) {
        this.repo = repo;
    }
    async getAtiva() {
        const config = await this.repo.findOne({ where: { ativo: true } });
        if (!config)
            throw new common_1.NotFoundException('Nenhuma configuração de tarifa ativa.');
        return config;
    }
    async findAll() {
        return this.repo.find({ order: { id: 'DESC' } });
    }
    async update(id, dto) {
        const config = await this.repo.findOne({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Configuração não encontrada.');
        Object.assign(config, dto);
        return this.repo.save(config);
    }
    async desativarTodas() {
        const ativas = await this.repo.find({ where: { ativo: true } });
        for (const c of ativas) {
            c.ativo = false;
        }
        if (ativas.length > 0)
            await this.repo.save(ativas);
    }
    async create(dto) {
        await this.desativarTodas();
        const config = this.repo.create({ ...dto, ativo: true });
        return this.repo.save(config);
    }
    async setAtiva(id) {
        await this.desativarTodas();
        const config = await this.repo.findOne({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Configuração não encontrada.');
        config.ativo = true;
        return this.repo.save(config);
    }
};
exports.ConfigTarifaService = ConfigTarifaService;
exports.ConfigTarifaService = ConfigTarifaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(config_tarifa_entity_1.ConfigTarifa)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfigTarifaService);
//# sourceMappingURL=config-tarifa.service.js.map