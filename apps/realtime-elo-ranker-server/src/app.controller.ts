import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { PlayerService } from './services/player/player.service';
import { MatchService } from './services/match/match.service';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';

const FAKE_PLAYERS = ['Player1', 'Player2', 'Player3']; // Remplacez par vos joueurs fictifs

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService,
    private readonly rankingCacheService: RankingCacheService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get/ranking')
  async getRanking(): Promise<any> {
    return await this.rankingCacheService.getRankingData();
  }

  @Get("/ranking/event")
  async rankingEvent(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const intervalId = setInterval(async () => { 
      const players = await this.rankingCacheService.getRankingData();
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const newRank = Math.floor(Math.random() * 2500);

      // Update player's rank in the database
      await this.rankingCacheService.updateRank(randomPlayer.name, newRank);

      res.write("event: message\n" + "data: " + JSON.stringify({
        type: "RankingUpdate",
        player: {
          id: randomPlayer.name,
          name: randomPlayer.name,
          rank: newRank
        }
      }) + '\n\n');
    }, 500);

    res.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }

  @Post('/post/player')
  async postPlayer(@Res() res: Response, @Body() body: { id: string }): Promise<void> {
    const { id } = body;
    const averageRank = await this.rankingCacheService.getAverageRanking();
    await this.playerService.addPlayer(id, averageRank);
    res.status(200).send(id);
  }

  @Post('/post/match')
  async postMatch(@Res() res: Response, @Body() body: { adversaryA: string, adversaryB: string, winner: string | null, draw: boolean }): Promise<void> {
    const result = await this.matchService.processMatch(body);
    res.status(200).send(result);
  }
}