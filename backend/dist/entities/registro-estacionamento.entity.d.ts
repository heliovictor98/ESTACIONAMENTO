export declare class RegistroEstacionamento {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    cor: string;
    horarioEntrada: Date;
    horarioSaida: Date | null;
    valorCobrado: number | null;
    createdAt: Date;
}
