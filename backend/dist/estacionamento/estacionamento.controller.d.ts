import { EstacionamentoService, EntradaDto, SaidaResult } from './estacionamento.service';
import { RegistroEstacionamento } from '../entities/registro-estacionamento.entity';
declare class EntradaBodyDto implements EntradaDto {
    placa: string;
    marca: string;
    modelo: string;
    cor: string;
}
export declare class EstacionamentoController {
    private service;
    constructor(service: EstacionamentoService);
    entrada(body: EntradaBodyDto): Promise<RegistroEstacionamento>;
    saida(id: number): Promise<SaidaResult>;
    saidaPorPlaca(placa: string): Promise<SaidaResult>;
    listarEmAberto(): Promise<RegistroEstacionamento[]>;
    listarTodos(placa?: string, dataInicio?: string, dataFim?: string): Promise<RegistroEstacionamento[]>;
    findOne(id: number): Promise<RegistroEstacionamento>;
}
export {};
