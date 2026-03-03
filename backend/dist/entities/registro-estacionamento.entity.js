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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroEstacionamento = void 0;
const typeorm_1 = require("typeorm");
let RegistroEstacionamento = class RegistroEstacionamento {
};
exports.RegistroEstacionamento = RegistroEstacionamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegistroEstacionamento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], RegistroEstacionamento.prototype, "placa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegistroEstacionamento.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegistroEstacionamento.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegistroEstacionamento.prototype, "cor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'horario_entrada' }),
    __metadata("design:type", Date)
], RegistroEstacionamento.prototype, "horarioEntrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'horario_saida', nullable: true }),
    __metadata("design:type", Object)
], RegistroEstacionamento.prototype, "horarioSaida", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'valor_cobrado',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RegistroEstacionamento.prototype, "valorCobrado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RegistroEstacionamento.prototype, "createdAt", void 0);
exports.RegistroEstacionamento = RegistroEstacionamento = __decorate([
    (0, typeorm_1.Entity)('registro_estacionamento')
], RegistroEstacionamento);
//# sourceMappingURL=registro-estacionamento.entity.js.map