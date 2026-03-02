export declare enum UnidadeIntervalo {
    SEGUNDOS = "SEGUNDOS",
    MINUTOS = "MINUTOS",
    HORAS = "HORAS"
}
export declare class ConfigTarifa {
    id: number;
    valorInicial: number;
    intervaloQuantidade: number;
    intervaloUnidade: UnidadeIntervalo;
    valorPorIntervalo: number;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
