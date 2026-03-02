import { AuthService, LoginDto, LoginResponse } from './auth.service';
declare class LoginBodyDto implements LoginDto {
    email: string;
    senha: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(body: LoginBodyDto): Promise<LoginResponse>;
}
export {};
