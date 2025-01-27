import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
