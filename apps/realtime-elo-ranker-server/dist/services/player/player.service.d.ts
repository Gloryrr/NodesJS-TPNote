import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';
export declare class PlayerService {
    private readonly playerRepository;
    private readonly rankingCacheService;
    constructor(playerRepository: Repository<Player>, rankingCacheService: RankingCacheService);
    addPlayer(id: string, rank: number): Promise<void>;
    getPlayer(id: number): Promise<Player | undefined>;
    getAllPlayers(): Promise<Player[]>;
    updatePlayer(id: number, rank: number): Promise<void>;
    deletePlayer(id: number): Promise<void>;
}
