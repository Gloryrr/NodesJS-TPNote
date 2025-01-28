import { Response } from 'express';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
export declare class AppController {
    private readonly appService;
    private readonly playerService;
    private readonly matchService;
    private readonly rankingCacheService;
    constructor(appService: AppService, playerService: PlayerService, matchService: MatchService, rankingCacheService: RankingCacheService);
    getHello(): string;
    getRanking(): Promise<any>;
    rankingEvent(res: Response): Promise<void>;
    postPlayer(res: Response, body: {
        id: string;
    }): Promise<void>;
    postMatch(res: Response, body: {
        adversaryA: string;
        adversaryB: string;
        winner: string | null;
        draw: boolean;
    }): Promise<void>;
}
