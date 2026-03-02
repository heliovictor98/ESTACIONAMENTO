export declare enum PerfilUsuario {
    GERENTE = "GERENTE",
    FUNCIONARIO = "FUNCIONARIO"
}
export declare class User {
    id: number;
    email: string;
    senhaHash: string;
    nome: string;
    perfil: PerfilUsuario;
    createdAt: Date;
}
