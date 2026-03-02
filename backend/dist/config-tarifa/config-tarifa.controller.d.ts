import { ConfigTarifaService, UpdateConfigTarifaDto } from './config-tarifa.service';
import { ConfigTarifa, UnidadeIntervalo } from '../entities/config-tarifa.entity';
declare class UpdateConfigTarifaBodyDto implements UpdateConfigTarifaDto {
    valorInicial?: number;
    intervaloQuantidade?: number;
    intervaloUnidade?: UnidadeIntervalo;
    valorPorIntervalo?: number;
}
declare class CreateConfigTarifaBodyDto {
    valorInicial: number;
    intervaloQuantidade: number;
    intervaloUnidade: UnidadeIntervalo;
    valorPorIntervalo: number;
}
export declare class ConfigTarifaController {
    private service;
    constructor(service: ConfigTarifaService);
    getAtiva(): Promise<ConfigTarifa>;
    findAll(): Promise<ConfigTarifa[]>;
    create(body: CreateConfigTarifaBodyDto): Promise<ConfigTarifa>;
    update(id: number, body: UpdateConfigTarifaBodyDto): Promise<ConfigTarifa>;
    setAtiva(id: number): Promise<ConfigTarifa>;
}
export {};
