import { PerfilUsuario } from '../../entities/user.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: PerfilUsuario[]) => import("@nestjs/common").CustomDecorator<string>;
