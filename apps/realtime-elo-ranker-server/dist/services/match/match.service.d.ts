export declare class MatchService {
    private static instance;
    private playerService;
    private ranckingCacheService;
    private constructor();
    static getInstance(): MatchService;
    processMatch(body: {
        adversaryA: string;
        adversaryB: string;
        winner: string | null;
        draw: boolean;
    }): string;
}
