import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { FAKE_PLAYERS } from './data/player.data';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  rankingCacheService = RankingCacheService.getInstance();
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get("/get/ranking")
  getRanking(): string {
    return this.rankingCacheService.getRankingData("ranking");
  }

  @Get("/ranking/event")
  getRankingEvent(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    setInterval(() => {
      res.write("event: message\n" + "data: " + JSON.stringify({
        type: "RankingUpdate",
        player: {
          id: FAKE_PLAYERS[Math.floor(Math.random() * FAKE_PLAYERS.length)],
          rank: Math.floor(Math.random() * 2500)
        }
      }) + '\n\n');
    }, 500);
  }

  @Post("/post/player")
  postPlayer(@Res() res: Response, @Body() body: { id: string }): void {
    const { id } = body;
    const playerService = PlayerService.getInstance();
    playerService.addPlayer( id, this.rankingCacheService.getAverageRanking() );
    res.status(200).send(id);
  }

  @Post("/post/match")
  async postMatch(@Res() res: Response, @Body() body: { adversaryA: string, adversaryB: string, winner: string | null, draw: boolean }): Promise<void> {
    const matchService = MatchService.getInstance();
    const { adversaryA, adversaryB, winner, draw } = body;
  
    console.log(`Received match: adversaryA=${adversaryA}, adversaryB=${adversaryB}, winner=${winner}, draw=${draw}`);
  
    if (!adversaryA || !adversaryB) {
      console.error('adversaryA or adversaryB is undefined');
      res.status(400).send('Invalid request: adversaryA or adversaryB is undefined');
      return;
    }
  
    const result = await matchService.processMatch({ adversaryA, adversaryB, winner, draw });
    res.status(200).send(result);
  }
}