"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const config_tarifa_entity_1 = require("./entities/config-tarifa.entity");
const registro_estacionamento_entity_1 = require("./entities/registro-estacionamento.entity");
const auth_module_1 = require("./auth/auth.module");
const config_tarifa_module_1 = require("./config-tarifa/config-tarifa.module");
const estacionamento_module_1 = require("./estacionamento/estacionamento.module");
const seed_service_1 = require("./seed/seed.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: 'estacionamento.db',
                entities: [user_entity_1.User, config_tarifa_entity_1.ConfigTarifa, registro_estacionamento_entity_1.RegistroEstacionamento],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, config_tarifa_entity_1.ConfigTarifa]),
            auth_module_1.AuthModule,
            config_tarifa_module_1.ConfigTarifaModule,
            estacionamento_module_1.EstacionamentoModule,
        ],
        providers: [seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map