import { Repository } from 'typeorm';
import { User, PerfilUsuario } from '../entities/user.entity';
export interface CreateFuncionarioDto {
    nome: string;
    email: string;
    perfil?: PerfilUsuario;
    telefone?: string;
    endereco?: string;
}
export interface UpdateFuncionarioDto {
    nome?: string;
    email?: string;
    perfil?: PerfilUsuario;
    telefone?: string;
    endereco?: string;
    ativo?: boolean;
}
export declare class FuncionariosService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    private semSenha;
    findAll(): Promise<Omit<User, 'senhaHash'>[]>;
    findOne(id: number): Promise<Omit<User, 'senhaHash'>>;
    create(dto: CreateFuncionarioDto): Promise<Omit<User, 'senhaHash'>>;
    update(id: number, dto: UpdateFuncionarioDto): Promise<Omit<User, 'senhaHash'>>;
    desativar(id: number): Promise<Omit<User, 'senhaHash'>>;
    reativar(id: number): Promise<Omit<User, 'senhaHash'>>;
    resetarSenha(id: number, novaSenha: string): Promise<void>;
}
