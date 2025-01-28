import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';
export declare class MatchService {
    private readonly playerRepository;
    private readonly rankingCacheService;
    constructor(playerRepository: Repository<Player>, rankingCacheService: RankingCacheService);
    processMatch(body: {
        adversaryA: string;
        adversaryB: string;
        winner: string | null;
        draw: boolean;
    }): Promise<string>;
}
