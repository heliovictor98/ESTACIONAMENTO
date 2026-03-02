export declare enum PerfilUsuario {
    GERENTE = "GERENTE",
    FUNCIONARIO = "FUNCIONARIO"
}
export declare const PRIMEIRO_ACESSO_SENHA = "__PRIMEIRO_ACESSO__";
export declare class User {
    id: number;
    email: string;
    senhaHash: string;
    nome: string;
    telefone: string | null;
    endereco: string | null;
    perfil: PerfilUsuario;
    ativo: boolean;
    createdAt: Date;
}
