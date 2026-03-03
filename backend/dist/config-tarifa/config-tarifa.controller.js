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
exports.ConfigTarifaController = void 0;
const common_1 = require("@nestjs/common");
const config_tarifa_service_1 = require("./config-tarifa.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
const config_tarifa_entity_1 = require("../entities/config-tarifa.entity");
const class_validator_1 = require("class-validator");
class UpdateConfigTarifaBodyDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateConfigTarifaBodyDto.prototype, "valorInicial", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateConfigTarifaBodyDto.prototype, "intervaloQuantidade", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(config_tarifa_entity_1.UnidadeIntervalo),
    __metadata("design:type", String)
], UpdateConfigTarifaBodyDto.prototype, "intervaloUnidade", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateConfigTarifaBodyDto.prototype, "valorPorIntervalo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateConfigTarifaBodyDto.prototype, "vagasTotais", void 0);
class CreateConfigTarifaBodyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigTarifaBodyDto.prototype, "valorInicial", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateConfigTarifaBodyDto.prototype, "intervaloQuantidade", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(config_tarifa_entity_1.UnidadeIntervalo),
    __metadata("design:type", String)
], CreateConfigTarifaBodyDto.prototype, "intervaloUnidade", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigTarifaBodyDto.prototype, "valorPorIntervalo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigTarifaBodyDto.prototype, "vagasTotais", void 0);
let ConfigTarifaController = class ConfigTarifaController {
    constructor(service) {
        this.service = service;
    }
    getAtiva() {
        return this.service.getAtiva();
    }
    findAll() {
        return this.service.findAll();
    }
    create(body) {
        return this.service.create(body);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
    setAtiva(id) {
        return this.service.setAtiva(id);
    }
};
exports.ConfigTarifaController = ConfigTarifaController;
__decorate([
    (0, common_1.Get)('ativa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigTarifaController.prototype, "getAtiva", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.PerfilUsuario.GERENTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigTarifaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.PerfilUsuario.GERENTE),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConfigTarifaBodyDto]),
    __metadata("design:returntype", Promise)
], ConfigTarifaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.PerfilUsuario.GERENTE),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateConfigTarifaBodyDto]),
    __metadata("design:returntype", Promise)
], ConfigTarifaController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/ativar'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.PerfilUsuario.GERENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigTarifaController.prototype, "setAtiva", null);
exports.ConfigTarifaController = ConfigTarifaController = __decorate([
    (0, common_1.Controller)('config-tarifa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [config_tarifa_service_1.ConfigTarifaService])
], ConfigTarifaController);
//# sourceMappingURL=config-tarifa.controller.js.map