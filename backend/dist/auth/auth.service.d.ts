import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, PerfilUsuario } from '../entities/user.entity';
export interface LoginDto {
    email: string;
    senha: string;
}
export interface JwtPayload {
    sub: number;
    email: string;
    perfil: PerfilUsuario;
}
export interface LoginResponse {
    access_token: string;
    usuario: {
        id: number;
        email: string;
        nome: string;
        perfil: PerfilUsuario;
    };
    primeiroAcesso?: boolean;
}
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    login(dto: LoginDto): Promise<LoginResponse>;
    definirSenha(userId: number, novaSenha: string): Promise<void>;
    validateByPayload(payload: JwtPayload): Promise<User | null>;
    me(userId: number): Promise<LoginResponse['usuario'] & {
        primeiroAcesso: boolean;
    }>;
}
