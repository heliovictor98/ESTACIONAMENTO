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
exports.EstacionamentoController = void 0;
const common_1 = require("@nestjs/common");
const estacionamento_service_1 = require("./estacionamento.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const PLACA_BR_REGEX = /^[A-Za-z]{3}-?\d{4}$|^[A-Za-z]{3}\d[A-Za-z]\d{2}$/;
class EntradaBodyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(PLACA_BR_REGEX, { message: 'Placa inválida. Use o formato antigo (ABC-1234) ou Mercosul (ABC4D67).' }),
    __metadata("design:type", String)
], EntradaBodyDto.prototype, "placa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], EntradaBodyDto.prototype, "marca", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], EntradaBodyDto.prototype, "modelo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], EntradaBodyDto.prototype, "cor", void 0);
let EstacionamentoController = class EstacionamentoController {
    constructor(service) {
        this.service = service;
    }
    entrada(body) {
        return this.service.entrada(body);
    }
    saida(id) {
        return this.service.saida(id);
    }
    saidaPorPlaca(placa) {
        return this.service.saidaPorPlaca(placa);
    }
    listarEmAberto() {
        return this.service.listarEmAberto();
    }
    listarEncerrados(page, pageSize, placa, dataInicio, dataFim) {
        return this.service.listarEncerrados({
            page: page ? parseInt(page, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
            placa,
            dataInicio,
            dataFim,
        });
    }
    listarTodos(placa, dataInicio, dataFim) {
        return this.service.listarTodos({ placa, dataInicio, dataFim });
    }
    findOne(id) {
        return this.service.findOne(id);
    }
};
exports.EstacionamentoController = EstacionamentoController;
__decorate([
    (0, common_1.Post)('entrada'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntradaBodyDto]),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "entrada", null);
__decorate([
    (0, common_1.Post)('saida/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "saida", null);
__decorate([
    (0, common_1.Post)('saida-placa/:placa'),
    __param(0, (0, common_1.Param)('placa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "saidaPorPlaca", null);
__decorate([
    (0, common_1.Get)('em-aberto'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "listarEmAberto", null);
__decorate([
    (0, common_1.Get)('encerrados'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('placa')),
    __param(3, (0, common_1.Query)('dataInicio')),
    __param(4, (0, common_1.Query)('dataFim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], EstacionamentoController.prototype, "listarEncerrados", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('placa')),
    __param(1, (0, common_1.Query)('dataInicio')),
    __param(2, (0, common_1.Query)('dataFim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "listarTodos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EstacionamentoController.prototype, "findOne", null);
exports.EstacionamentoController = EstacionamentoController = __decorate([
    (0, common_1.Controller)('estacionamento'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [estacionamento_service_1.EstacionamentoService])
], EstacionamentoController);
//# sourceMappingURL=estacionamento.controller.js.map