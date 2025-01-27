export declare class PlayerService {
    private static instance;
    private rankingCacheService;
    private constructor();
    static getInstance(): PlayerService;
    addPlayer(id: string, rank: number): void;
    getPlayer(id: string): any;
    getRank(id: string): number;
    updatePlayer(id: string, rank: number): void;
    deletePlayer(id: string): void;
    getAllPlayers(): any[];
}
