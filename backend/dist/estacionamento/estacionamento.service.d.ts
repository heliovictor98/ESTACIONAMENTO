import { Repository } from 'typeorm';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
import { ConfigTarifaService } from '../config-tarifa/config-tarifa.service';
import { UnidadeIntervalo } from '../entities/config-tarifa.entity';
export interface EntradaDto {
    placa: string;
    marca: string;
    modelo: string;
    cor: string;
}
export interface SaidaResult {
    registro: RegistroEstacionamento;
    tempoMinutos: number;
    valorCobrado: number;
}
export declare class EstacionamentoService {
    private repo;
    private configTarifa;
    constructor(repo: Repository<RegistroEstacionamento>, configTarifa: ConfigTarifaService);
    entrada(dto: EntradaDto): Promise<RegistroEstacionamento>;
    private intervaloEmSegundos;
    calcularValor(horarioEntrada: Date, horarioSaida: Date, valorInicial: number, intervaloQuantidade: number, intervaloUnidade: UnidadeIntervalo, valorPorIntervalo: number): {
        tempoSegundos: number;
        tempoMinutos: number;
        valorCobrado: number;
    };
    saida(id: number): Promise<SaidaResult>;
    saidaPorPlaca(placa: string): Promise<SaidaResult>;
    listarEmAberto(): Promise<RegistroEstacionamento[]>;
    listarTodos(filtro?: {
        placa?: string;
        dataInicio?: string;
        dataFim?: string;
    }): Promise<RegistroEstacionamento[]>;
    findOne(id: number): Promise<RegistroEstacionamento>;
}
