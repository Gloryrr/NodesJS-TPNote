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

  addPlayer(player: { id: string, rank: number }): void {
    const key = `player_${player.id}`;
    this.rankingCacheService.cache.set(key, player);
  }

  getPlayer(id: string): any {
    const key = `player_${id}`;
    return this.rankingCacheService.cache.get(key);
  }

  updatePlayer(id: string, rank: number): void {
    const key = `player_${id}`;
    const player = this.rankingCacheService.cache.get(key);
    if (player) {
      player.rank = rank;
      this.rankingCacheService.cache.set(key, player);
    }
  }

  deletePlayer(id: string): void {
    const key = `player_${id}`;
    this.rankingCacheService.cache.delete(key);
  }

  getAllPlayers(): any[] {
    const players: any[] = [];
    this.rankingCacheService.cache.forEach((value, key) => {
      if (key.startsWith('player_')) {
        players.push(value);
      }
    });
    return players;
  }
}