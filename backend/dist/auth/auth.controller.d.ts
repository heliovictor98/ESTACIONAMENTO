import { AuthService, LoginDto, LoginResponse } from './auth.service';
import { Request } from 'express';
import { User } from '../entities/user.entity';
declare class LoginBodyDto implements LoginDto {
    email: string;
    senha: string;
}
declare class DefinirSenhaBodyDto {
    novaSenha: string;
}
interface RequestComUser extends Request {
    user?: User;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(body: LoginBodyDto): Promise<LoginResponse>;
    me(req: RequestComUser): Promise<{
        id: number;
        email: string;
        nome: string;
        perfil: string;
        primeiroAcesso: boolean;
    }>;
    definirSenha(req: RequestComUser, body: DefinirSenhaBodyDto): Promise<{
        message: string;
    }>;
}
export {};
