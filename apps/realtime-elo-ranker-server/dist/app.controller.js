"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const player_service_1 = require("./services/player/player.service");
const match_service_1 = require("./services/match/match.service");
const ranking_cache_service_1 = require("./services/ranking-cache/ranking-cache.service");
const FAKE_PLAYERS = ['Player1', 'Player2', 'Player3'];
let AppController = class AppController {
    constructor(appService, playerService, matchService, rankingCacheService) {
        this.appService = appService;
        this.playerService = playerService;
        this.matchService = matchService;
        this.rankingCacheService = rankingCacheService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getRanking() {
        return await this.rankingCacheService.getRankingData();
    }
    async rankingEvent(res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const intervalId = setInterval(async () => {
            const players = await this.rankingCacheService.getRankingData();
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            const newRank = Math.floor(Math.random() * 2500);
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
    async postPlayer(res, body) {
        const { id } = body;
        const averageRank = await this.rankingCacheService.getAverageRanking();
        await this.playerService.addPlayer(id, averageRank);
        res.status(200).send(id);
    }
    async postMatch(res, body) {
        const result = await this.matchService.processMatch(body);
        res.status(200).send(result);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/get/ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)("/ranking/event"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "rankingEvent", null);
__decorate([
    (0, common_1.Post)('/post/player'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postPlayer", null);
__decorate([
    (0, common_1.Post)('/post/match'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postMatch", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        player_service_1.PlayerService,
        match_service_1.MatchService,
        ranking_cache_service_1.RankingCacheService])
], AppController);
//# sourceMappingURL=app.controller.js.map