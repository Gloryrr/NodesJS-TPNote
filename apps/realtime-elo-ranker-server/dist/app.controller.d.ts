import { Response } from 'express';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    rankingCacheService: RankingCacheService;
    getHello(): string;
    getRanking(): string;
    getRankingEvent(res: Response): void;
    postPlayer(res: Response, body: {
        id: string;
    }): void;
    postMatch(res: Response, body: {
        adversaryA: string;
        adversaryB: string;
        winner: string | null;
        draw: boolean;
    }): Promise<void>;
}
