import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../data/model/PlayerEntity';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly rankingCacheService: RankingCacheService,
  ) {}

  async addPlayer(name: string, rank: number): Promise<void> {
    const existingPlayer = await this.playerRepository.findOne({ where: { name } });
    if (! existingPlayer) {
      const player = new Player();
      player.name = name;
      player.rank = rank;
      await this.playerRepository.save(player);
    }
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const player = await this.playerRepository.findOne({ where: { id } });
    return player ?? undefined;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerRepository.find();
  }

  async updatePlayer(id: number, rank: number): Promise<void> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (player) {
      player.rank = rank;
      await this.playerRepository.save(player);
    }
  }

  async deletePlayer(id: number): Promise<void> {
    await this.playerRepository.delete({ id });
  }
}