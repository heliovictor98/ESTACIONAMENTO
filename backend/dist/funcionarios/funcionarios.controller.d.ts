import { FuncionariosService, CreateFuncionarioDto, UpdateFuncionarioDto } from './funcionarios.service';
import { PerfilUsuario } from '../entities/user.entity';
declare class CreateFuncionarioBodyDto implements CreateFuncionarioDto {
    nome: string;
    email: string;
    perfil?: PerfilUsuario;
    telefone?: string;
    endereco?: string;
}
declare class UpdateFuncionarioBodyDto implements UpdateFuncionarioDto {
    nome?: string;
    email?: string;
    perfil?: PerfilUsuario;
    telefone?: string;
    endereco?: string;
    ativo?: boolean;
}
declare class ResetSenhaBodyDto {
    novaSenha: string;
}
export declare class FuncionariosController {
    private service;
    constructor(service: FuncionariosService);
    findAll(): Promise<Omit<import("../entities/user.entity").User, "senhaHash">[]>;
    findOne(id: number): Promise<Omit<import("../entities/user.entity").User, "senhaHash">>;
    create(body: CreateFuncionarioBodyDto): Promise<Omit<import("../entities/user.entity").User, "senhaHash">>;
    update(id: number, body: UpdateFuncionarioBodyDto): Promise<Omit<import("../entities/user.entity").User, "senhaHash">>;
    desativar(id: number): Promise<Omit<import("../entities/user.entity").User, "senhaHash">>;
    reativar(id: number): Promise<Omit<import("../entities/user.entity").User, "senhaHash">>;
    resetarSenha(id: number, body: ResetSenhaBodyDto): Promise<{
        message: string;
    }>;
}
export {};
