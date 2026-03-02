import { Repository } from 'typeorm';
import { ConfigTarifa, UnidadeIntervalo } from '../entities/config-tarifa.entity';
export interface UpdateConfigTarifaDto {
    valorInicial?: number;
    intervaloQuantidade?: number;
    intervaloUnidade?: UnidadeIntervalo;
    valorPorIntervalo?: number;
}
export declare class ConfigTarifaService {
    private repo;
    constructor(repo: Repository<ConfigTarifa>);
    getAtiva(): Promise<ConfigTarifa>;
    findAll(): Promise<ConfigTarifa[]>;
    update(id: number, dto: UpdateConfigTarifaDto): Promise<ConfigTarifa>;
    private desativarTodas;
    create(dto: Omit<UpdateConfigTarifaDto, never> & {
        valorInicial: number;
        intervaloQuantidade: number;
        intervaloUnidade: UnidadeIntervalo;
        valorPorIntervalo: number;
    }): Promise<ConfigTarifa>;
    setAtiva(id: number): Promise<ConfigTarifa>;
}
