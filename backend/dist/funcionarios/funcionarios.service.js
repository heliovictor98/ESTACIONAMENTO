"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
let FuncionariosService = class FuncionariosService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    semSenha(u) {
        const { senhaHash: _, ...rest } = u;
        return rest;
    }
    async findAll() {
        const list = await this.userRepo.find({ order: { nome: 'ASC' } });
        return list.map((u) => this.semSenha(u));
    }
    async findOne(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return this.semSenha(user);
    }
    async create(dto) {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Já existe um usuário com este e-mail.');
        const user = this.userRepo.create({
            nome: dto.nome,
            email: dto.email,
            telefone: dto.telefone ?? null,
            endereco: dto.endereco ?? null,
            perfil: dto.perfil ?? user_entity_1.PerfilUsuario.FUNCIONARIO,
            senhaHash: user_entity_1.PRIMEIRO_ACESSO_SENHA,
            ativo: true,
        });
        const saved = await this.userRepo.save(user);
        return this.semSenha(saved);
    }
    async update(id, dto) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        if (dto.email != null && dto.email !== user.email) {
            const exists = await this.userRepo.findOne({ where: { email: dto.email } });
            if (exists)
                throw new common_1.ConflictException('Já existe um usuário com este e-mail.');
            user.email = dto.email;
        }
        if (dto.nome != null)
            user.nome = dto.nome;
        if (dto.perfil != null)
            user.perfil = dto.perfil;
        if (dto.telefone !== undefined)
            user.telefone = dto.telefone || null;
        if (dto.endereco !== undefined)
            user.endereco = dto.endereco || null;
        if (dto.ativo !== undefined)
            user.ativo = dto.ativo;
        const saved = await this.userRepo.save(user);
        return this.semSenha(saved);
    }
    async desativar(id) {
        const user = await this.userRepo.findOneOrFail({ where: { id } });
        user.ativo = false;
        return this.semSenha(await this.userRepo.save(user));
    }
    async reativar(id) {
        const user = await this.userRepo.findOneOrFail({ where: { id } });
        user.ativo = true;
        return this.semSenha(await this.userRepo.save(user));
    }
    async resetarSenha(id, novaSenha) {
        const user = await this.userRepo.findOneOrFail({ where: { id } });
        user.senhaHash = await bcrypt.hash(novaSenha, 10);
        await this.userRepo.save(user);
    }
};
exports.FuncionariosService = FuncionariosService;
exports.FuncionariosService = FuncionariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FuncionariosService);
//# sourceMappingURL=funcionarios.service.js.map