import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly rankingCacheService: RankingCacheService,
  ) {}

  async processMatch(body: { adversaryA: string, adversaryB: string, winner: string | null, draw: boolean }): Promise<string> {
    const { adversaryA, adversaryB, winner, draw } = body;

    const adversaryAPlayer = await this.playerRepository.findOne({ where: { name: adversaryA } });
    const adversaryBPlayer = await this.playerRepository.findOne({ where: { name: adversaryB } });
    console.log(adversaryAPlayer, adversaryBPlayer);

    if (!adversaryAPlayer || !adversaryBPlayer) {
      throw new Error('Les deux joueurs ne sont pas enregistrés');
    }

    const adversaryAPlayerRank = adversaryAPlayer.rank;
    const adversaryBPlayerRank = adversaryBPlayer.rank;

    const K = 32;
    const WeA = 1 / (1 + Math.pow(10, (adversaryBPlayerRank - adversaryAPlayerRank) / 400));
    const WeB = 1 / (1 + Math.pow(10, (adversaryAPlayerRank - adversaryBPlayerRank) / 400));

    let scoreA = 0.5;
    let scoreB = 0.5;
    let result = 'Match nul';

    if (!draw) {
      if (winner === adversaryA) {
        scoreA = 1;
        scoreB = 0;
        result = `${adversaryA} a battu ${adversaryB}`;
      } else if (winner === adversaryB) {
        scoreA = 0;
        scoreB = 1;
        result = `${adversaryB} a battu ${adversaryA}`;
      } else {
        throw new Error('le résultat du match est invalide');
      }
    }

    const scoreFinalA = Math.round(adversaryAPlayerRank + K * (scoreA - WeA));
    const scoreFinalB = Math.round(adversaryBPlayerRank + K * (scoreB - WeB));

    await this.rankingCacheService.updateRank(adversaryA, scoreFinalA);
    await this.rankingCacheService.updateRank(adversaryB, scoreFinalB);

    return result;
  }
}