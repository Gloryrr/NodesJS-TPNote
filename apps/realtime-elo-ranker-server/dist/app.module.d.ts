import { OnModuleInit } from '@nestjs/common';
import { Player } from './data/model/PlayerEntity';
import { Repository } from 'typeorm';
export declare class AppModule implements OnModuleInit {
    private readonly playerRepository;
    constructor(playerRepository: Repository<Player>);
    onModuleInit(): Promise<void>;
    private addFakePlayers;
}
