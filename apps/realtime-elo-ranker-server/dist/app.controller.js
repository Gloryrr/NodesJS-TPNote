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
const player_data_1 = require("./data/player.data");
const ranking_cache_service_1 = require("./services/ranking-cache/ranking-cache.service");
const player_service_1 = require("./services/player/player.service");
const match_service_1 = require("./services/match/match.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
        this.rankingCacheService = ranking_cache_service_1.RankingCacheService.getInstance();
    }
    getHello() {
        return this.appService.getHello();
    }
    getRanking() {
        return this.rankingCacheService.getRankingData("ranking");
    }
    getRankingEvent(res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        setInterval(() => {
            res.write("event: message\n" + "data: " + JSON.stringify({
                type: "RankingUpdate",
                player: {
                    id: player_data_1.FAKE_PLAYERS[Math.floor(Math.random() * player_data_1.FAKE_PLAYERS.length)],
                    rank: Math.floor(Math.random() * 2500)
                }
            }) + '\n\n');
        }, 500);
    }
    postPlayer(res, body) {
        const { id } = body;
        const playerService = player_service_1.PlayerService.getInstance();
        playerService.addPlayer(id, this.rankingCacheService.getAverageRanking());
        res.status(200).send(id);
    }
    async postMatch(res, body) {
        const matchService = match_service_1.MatchService.getInstance();
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("/get/ranking"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)("/ranking/event"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRankingEvent", null);
__decorate([
    (0, common_1.Post)("/post/player"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "postPlayer", null);
__decorate([
    (0, common_1.Post)("/post/match"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postMatch", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map