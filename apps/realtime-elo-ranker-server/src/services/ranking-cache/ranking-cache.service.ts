import { Injectable } from '@nestjs/common';
import { FAKE_PLAYERS } from '../../data/player.data';

@Injectable()
export class RankingCacheService {
  private static instance: RankingCacheService;
  public cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
    const fakeRanking = FAKE_PLAYERS.map((player, index) => ({
      id: player,
      rank: 1000 + index * 10
    })).sort((a, b) => b.rank - a.rank);
    this.cache.set('ranking', fakeRanking);
  }

  public static getInstance(): RankingCacheService {
    if (!RankingCacheService.instance) {
      RankingCacheService.instance = new RankingCacheService();
    }
    return RankingCacheService.instance;
  }


  public setRankingData(key: string, data: any): void {
    this.cache.set(key, data);
  }

  public getRankingData(key: string): any | undefined {
    return this.cache.get(key);
  }

  public clearRankingData(key: string): void {
    this.cache.delete(key);
  }

  public clearAllRankingData(): void {
    this.cache.clear();
  }
}