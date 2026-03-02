"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstacionamentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const registro_estacionamento_entity_1 = require("../entities/registro-estacionamento.entity");
const config_tarifa_module_1 = require("../config-tarifa/config-tarifa.module");
const estacionamento_service_1 = require("./estacionamento.service");
const estacionamento_controller_1 = require("./estacionamento.controller");
let EstacionamentoModule = class EstacionamentoModule {
};
exports.EstacionamentoModule = EstacionamentoModule;
exports.EstacionamentoModule = EstacionamentoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([registro_estacionamento_entity_1.RegistroEstacionamento]),
            config_tarifa_module_1.ConfigTarifaModule,
        ],
        controllers: [estacionamento_controller_1.EstacionamentoController],
        providers: [estacionamento_service_1.EstacionamentoService],
        exports: [estacionamento_service_1.EstacionamentoService],
    })
], EstacionamentoModule);
//# sourceMappingURL=estacionamento.module.js.map