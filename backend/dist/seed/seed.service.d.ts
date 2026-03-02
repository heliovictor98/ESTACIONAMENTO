import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConfigTarifa } from '../entities/config-tarifa.entity';
export declare class SeedService implements OnModuleInit {
    private userRepo;
    private configRepo;
    constructor(userRepo: Repository<User>, configRepo: Repository<ConfigTarifa>);
    onModuleInit(): Promise<void>;
    private seedUsers;
    private seedConfigTarifa;
}
