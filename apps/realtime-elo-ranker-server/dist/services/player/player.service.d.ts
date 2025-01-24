export declare class PlayerService {
    private static instance;
    private rankingCacheService;
    private constructor();
    static getInstance(): PlayerService;
    addPlayer(player: {
        id: string;
        rank: number;
    }): void;
    getPlayer(id: string): any;
    updatePlayer(id: string, rank: number): void;
    deletePlayer(id: string): void;
    getAllPlayers(): any[];
}
