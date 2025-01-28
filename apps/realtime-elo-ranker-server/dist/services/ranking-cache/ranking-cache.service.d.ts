import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';
export declare class RankingCacheService {
    private readonly playerRepository;
    constructor(playerRepository: Repository<Player>);
    setRankingData(id: string, rank: number): Promise<void>;
    getRankingData(): Promise<Player[]>;
    getAverageRanking(): Promise<number>;
    updateRank(id: string, newRank: number): Promise<void>;
}
