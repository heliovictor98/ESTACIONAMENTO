import { EstacionamentoService, EntradaDto, SaidaResult } from './estacionamento.service';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
declare class EntradaBodyDto implements EntradaDto {
    placa: string;
    marca?: string;
    modelo?: string;
    cor?: string;
}
export declare class EstacionamentoController {
    private service;
    constructor(service: EstacionamentoService);
    entrada(body: EntradaBodyDto): Promise<RegistroEstacionamento>;
    saida(id: number): Promise<SaidaResult>;
    saidaPorPlaca(placa: string): Promise<SaidaResult>;
    listarEmAberto(): Promise<RegistroEstacionamento[]>;
    listarEncerrados(page?: string, pageSize?: string, placa?: string, dataInicio?: string, dataFim?: string): Promise<{
        data: RegistroEstacionamento[];
        total: number;
    }>;
    listarTodos(placa?: string, dataInicio?: string, dataFim?: string): Promise<RegistroEstacionamento[]>;
    findOne(id: number): Promise<RegistroEstacionamento>;
}
export {};
