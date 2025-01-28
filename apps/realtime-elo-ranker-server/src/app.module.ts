import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';
import { Player } from './data/model/PlayerEntity';
import { FAKE_PLAYERS } from './data/player.data';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Player],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player]),
  ],
  controllers: [AppController],
  providers: [AppService, PlayerService, RankingCacheService, MatchService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async onModuleInit() {
    await this.addFakePlayers();
  }

  private async addFakePlayers() {
    if (await this.playerRepository.count() === 0) {
      const fakeRanking = FAKE_PLAYERS.map((player, index) => ({
        id: player,
        rank: 1000 + index * 10,
      })).sort((a, b) => b.rank - a.rank);

      const players = fakeRanking.map(ranking => {
        const player = new Player();
        player.name = ranking.id;
        player.rank = ranking.rank;
        return player;
      });

      await this.playerRepository.save(players);
    }
  }
}