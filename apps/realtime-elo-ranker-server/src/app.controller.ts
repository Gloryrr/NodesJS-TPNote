import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { FAKE_PLAYERS } from './data/player.data';
import { RankingCacheService } from './services/ranking-cache/ranking-cache.service';
import { PlayerService } from './services/player/player.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/get/ranking")
  getRanking(): string {
    const playerService = PlayerService.getInstance();
    return playerService.getAllPlayer();
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
    playerService.addPlayer({ id, rank: 1000 });
    res.status(200).send(JSON.stringify({
      id,
      rank: 10000
    }));
  }
}


