import { Injectable } from '@nestjs/common';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

@Injectable()
export class PlayerService {
  private static instance: PlayerService;
  private rankingCacheService: RankingCacheService;

  private constructor() {
    this.rankingCacheService = RankingCacheService.getInstance();
  }

  public static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  addPlayer(id: string, rank: number ): void {
    const key = id;
    this.rankingCacheService.setRankingData(key, rank);
  }

  getPlayer(id: string): any {
    const key = id;
    return this.rankingCacheService.getId(key);
  }

  getRank(id: string): number {
    const key = id;
    return this.rankingCacheService.getRank(key);
  }

  updatePlayer(id: string, rank: number): void {
    const key = id;
    const player = this.rankingCacheService.cache.get(key);
    if (player) {
      player.rank = rank;
      this.rankingCacheService.updateRank(key, player);
    }
  }

  deletePlayer(id: string): void {
    const key = `player_${id}`;
    this.rankingCacheService.cache.delete(key);
  }

  getAllPlayers(): any[] {
    const players: any[] = [];
    this.rankingCacheService.cache.forEach((value, key) => {
      if (key.startsWith('ranking')) {
        players.push(value);
      }
    });
    return players;
  }
}