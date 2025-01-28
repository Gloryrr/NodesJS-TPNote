import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';

@Injectable()
export class RankingCacheService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  public async setRankingData(id: string, rank: number): Promise<void> {
    const player = new Player();
    player.name = id;
    player.rank = rank;
    await this.playerRepository.save(player);
  }

  public async getRankingData(): Promise<Player[]> {
    return await this.playerRepository.find({ order: { rank: 'DESC' } });
  }

  public async getAverageRanking(): Promise<number> {
    const players = await this.playerRepository.find();
    if (players.length === 0) {
      return 0;
    }
    const total = players.reduce((acc, player) => acc + player.rank, 0);
    return total / players.length;
  }

  public async updateRank(id: string, newRank: number): Promise<void> {
    const player = await this.playerRepository.findOne({ where: { name: id } });
    if (player) {
      player.rank = newRank;
      await this.playerRepository.save(player);
    }
  }
}