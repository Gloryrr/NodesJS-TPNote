import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

@Injectable()
export class MatchService {
  private static instance: MatchService;
  private playerService: PlayerService;
  private ranckingCacheService: RankingCacheService;

  private constructor() {
    this.playerService = PlayerService.getInstance();
    this.ranckingCacheService = RankingCacheService.getInstance();
  }

  public static getInstance(): MatchService {
    if (!MatchService.instance) {
      MatchService.instance = new MatchService();
    }
    return MatchService.instance;
  }

  processMatch(body: { adversaryA: string, adversaryB: string, winner: string | null, draw: boolean }): string {
      const { adversaryA, adversaryB, winner, draw } = body;
      const adversaryAPlayer = this.playerService.getPlayer(adversaryA);
      const adversaryBPlayer = this.playerService.getPlayer(adversaryB);
      const adversaryAPlayerRank = this.ranckingCacheService.getRank(adversaryA);
      const adversaryBPlayerRank = this.ranckingCacheService.getRank(adversaryB);

      if (!adversaryAPlayer || !adversaryBPlayer) {
        throw new Error('Player not found');
      }
    
      const K = 32; // Coefficient de pondération
    
      // Calcul des probabilités de victoire
      const WeA = 1 / (1 + Math.pow(10, (adversaryBPlayerRank - adversaryAPlayerRank) / 400));
      const WeB = 1 / (1 + Math.pow(10, (adversaryAPlayerRank - adversaryBPlayerRank) / 400));
    
      let result: string;
      let scoreA: number;
      let scoreB: number;

      if (draw) {
        // Draw
        scoreA = 0.5;
        scoreB = 0.5;
        result = 'Match was a draw';
      } else if (winner === adversaryA) {
        // Adversary A wins
        scoreA = 1;
        scoreB = 0;
        result = `Match processed: ${adversaryA} defeated ${adversaryB}`;
      } else if (winner === adversaryB) {
        // Adversary B wins
        scoreA = 0;
        scoreB = 1;
        result = `Match processed: ${adversaryB} defeated ${adversaryA}`;
      } else {
        throw new Error('Invalid match result');
      }
    
      // Mise à jour des classements
      const scoreFinalA = Math.round(adversaryAPlayerRank + K * (scoreA - WeA));
      const scoreFinalB = Math.round(adversaryBPlayerRank + K * (scoreB - WeB));
      this.ranckingCacheService.updateRank(adversaryA, scoreFinalA);
      this.ranckingCacheService.updateRank(adversaryB, scoreFinalB);
      
      return result;
  }
}