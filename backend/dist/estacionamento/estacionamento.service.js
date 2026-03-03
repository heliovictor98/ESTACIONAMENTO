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
exports.EstacionamentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registro_estacionamento_entity_1 = require("../entities/registro-estacionamento.entity");
const config_tarifa_service_1 = require("../config-tarifa/config-tarifa.service");
const config_tarifa_entity_1 = require("../entities/config-tarifa.entity");
function normalizarPlaca(placa) {
    return placa.replace(/\s/g, '').replace(/-/g, '').toUpperCase();
}
let EstacionamentoService = class EstacionamentoService {
    constructor(repo, configTarifa) {
        this.repo = repo;
        this.configTarifa = configTarifa;
    }
    async entrada(dto) {
        const placaNorm = normalizarPlaca(dto.placa);
        const emAberto = await this.repo.findOne({
            where: { placa: placaNorm, horarioSaida: (0, typeorm_2.IsNull)() },
        });
        if (emAberto) {
            throw new common_1.BadRequestException(`Já existe registro em aberto para a placa ${dto.placa}.`);
        }
        const reg = this.repo.create({
            placa: placaNorm,
            marca: dto.marca?.trim() || null,
            modelo: dto.modelo?.trim() || null,
            cor: dto.cor?.trim() || null,
            horarioEntrada: new Date(),
        });
        return this.repo.save(reg);
    }
    intervaloEmSegundos(quantidade, unidade) {
        switch (unidade) {
            case config_tarifa_entity_1.UnidadeIntervalo.SEGUNDOS:
                return quantidade;
            case config_tarifa_entity_1.UnidadeIntervalo.MINUTOS:
                return quantidade * 60;
            case config_tarifa_entity_1.UnidadeIntervalo.HORAS:
                return quantidade * 3600;
            default:
                return quantidade;
        }
    }
    calcularValor(horarioEntrada, horarioSaida, valorInicial, intervaloQuantidade, intervaloUnidade, valorPorIntervalo) {
        const tempoSegundos = (horarioSaida.getTime() - horarioEntrada.getTime()) / 1000;
        const intervaloSeg = this.intervaloEmSegundos(intervaloQuantidade, intervaloUnidade);
        const numIntervalos = Math.max(0, Math.ceil(tempoSegundos / intervaloSeg));
        const valorCobrado = Number((Number(valorInicial) + numIntervalos * Number(valorPorIntervalo)).toFixed(2));
        return {
            tempoSegundos,
            tempoMinutos: Math.round((tempoSegundos / 60) * 100) / 100,
            valorCobrado,
        };
    }
    async saida(id) {
        const registro = await this.repo.findOne({ where: { id } });
        if (!registro)
            throw new common_1.NotFoundException('Registro não encontrado.');
        if (registro.horarioSaida) {
            throw new common_1.BadRequestException('Saída já registrada para este veículo.');
        }
        const config = await this.configTarifa.getAtiva();
        const horarioSaida = new Date();
        const { tempoMinutos, valorCobrado } = this.calcularValor(registro.horarioEntrada, horarioSaida, Number(config.valorInicial), config.intervaloQuantidade, config.intervaloUnidade, Number(config.valorPorIntervalo));
        registro.horarioSaida = horarioSaida;
        registro.valorCobrado = valorCobrado;
        await this.repo.save(registro);
        return { registro, tempoMinutos, valorCobrado };
    }
    async saidaPorPlaca(placa) {
        const registro = await this.repo.findOne({
            where: { placa: normalizarPlaca(placa), horarioSaida: (0, typeorm_2.IsNull)() },
        });
        if (!registro) {
            throw new common_1.NotFoundException(`Nenhum registro em aberto para a placa ${placa}.`);
        }
        return this.saida(registro.id);
    }
    async listarEmAberto() {
        return this.repo.find({
            where: { horarioSaida: (0, typeorm_2.IsNull)() },
            order: { horarioEntrada: 'DESC' },
        });
    }
    async listarTodos(filtro) {
        const qb = this.repo
            .createQueryBuilder('r')
            .orderBy('r.horario_entrada', 'DESC');
        if (filtro?.placa) {
            qb.andWhere('r.placa LIKE :placa', { placa: `%${filtro.placa}%` });
        }
        if (filtro?.dataInicio) {
            qb.andWhere('r.horario_entrada >= :dataInicio', {
                dataInicio: filtro.dataInicio,
            });
        }
        if (filtro?.dataFim) {
            qb.andWhere('r.horario_entrada <= :dataFim', { dataFim: filtro.dataFim });
        }
        return qb.getMany();
    }
    async listarEncerrados(filtro) {
        const page = Math.max(1, filtro.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filtro.pageSize ?? 10));
        const skip = (page - 1) * pageSize;
        const qb = this.repo
            .createQueryBuilder('r')
            .where('r.horario_saida IS NOT NULL')
            .orderBy('r.horario_saida', 'DESC');
        if (filtro?.placa?.trim()) {
            qb.andWhere('r.placa LIKE :placa', { placa: `%${filtro.placa.trim()}%` });
        }
        if (filtro?.dataInicio) {
            qb.andWhere('r.horario_saida >= :dataInicio', {
                dataInicio: filtro.dataInicio,
            });
        }
        if (filtro?.dataFim) {
            qb.andWhere('r.horario_saida <= :dataFim', { dataFim: filtro.dataFim });
        }
        const [data, total] = await qb.skip(skip).take(pageSize).getManyAndCount();
        return { data, total };
    }
    async findOne(id) {
        const reg = await this.repo.findOne({ where: { id } });
        if (!reg)
            throw new common_1.NotFoundException('Registro não encontrado.');
        return reg;
    }
};
exports.EstacionamentoService = EstacionamentoService;
exports.EstacionamentoService = EstacionamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_estacionamento_entity_1.RegistroEstacionamento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_tarifa_service_1.ConfigTarifaService])
], EstacionamentoService);
//# sourceMappingURL=estacionamento.service.js.map