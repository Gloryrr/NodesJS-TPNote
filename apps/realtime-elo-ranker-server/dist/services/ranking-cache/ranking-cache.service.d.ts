export declare class RankingCacheService {
    private static instance;
    cache: Map<string, any>;
    private constructor();
    static getInstance(): RankingCacheService;
    setRankingData(key: string, data: any): void;
    getRankingData(key: string): any | undefined;
    getId(key: string): any | undefined;
    getRank(key: string): any | undefined;
    updateRank(player: string, newRank: number): void;
    clearRankingData(key: string): void;
    clearAllRankingData(): void;
    getAverageRanking(): number;
}
