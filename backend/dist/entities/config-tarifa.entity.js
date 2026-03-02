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
exports.ConfigTarifa = exports.UnidadeIntervalo = void 0;
const typeorm_1 = require("typeorm");
var UnidadeIntervalo;
(function (UnidadeIntervalo) {
    UnidadeIntervalo["SEGUNDOS"] = "SEGUNDOS";
    UnidadeIntervalo["MINUTOS"] = "MINUTOS";
    UnidadeIntervalo["HORAS"] = "HORAS";
})(UnidadeIntervalo || (exports.UnidadeIntervalo = UnidadeIntervalo = {}));
let ConfigTarifa = class ConfigTarifa {
};
exports.ConfigTarifa = ConfigTarifa;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConfigTarifa.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'valor_inicial' }),
    __metadata("design:type", Number)
], ConfigTarifa.prototype, "valorInicial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'intervalo_quantidade' }),
    __metadata("design:type", Number)
], ConfigTarifa.prototype, "intervaloQuantidade", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: UnidadeIntervalo,
        name: 'intervalo_unidade',
    }),
    __metadata("design:type", String)
], ConfigTarifa.prototype, "intervaloUnidade", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'valor_por_intervalo',
    }),
    __metadata("design:type", Number)
], ConfigTarifa.prototype, "valorPorIntervalo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ConfigTarifa.prototype, "ativo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConfigTarifa.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ConfigTarifa.prototype, "updatedAt", void 0);
exports.ConfigTarifa = ConfigTarifa = __decorate([
    (0, typeorm_1.Entity)('config_tarifa')
], ConfigTarifa);
//# sourceMappingURL=config-tarifa.entity.js.map