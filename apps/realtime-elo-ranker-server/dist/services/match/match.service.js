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
var MatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const ranking_cache_service_1 = require("../ranking-cache/ranking-cache.service");
let MatchService = MatchService_1 = class MatchService {
    constructor() {
        this.playerService = player_service_1.PlayerService.getInstance();
        this.ranckingCacheService = ranking_cache_service_1.RankingCacheService.getInstance();
    }
    static getInstance() {
        if (!MatchService_1.instance) {
            MatchService_1.instance = new MatchService_1();
        }
        return MatchService_1.instance;
    }
    processMatch(body) {
        const { adversaryA, adversaryB, winner, draw } = body;
        const adversaryAPlayer = this.playerService.getPlayer(adversaryA);
        const adversaryBPlayer = this.playerService.getPlayer(adversaryB);
        const adversaryAPlayerRank = this.ranckingCacheService.getRank(adversaryA);
        const adversaryBPlayerRank = this.ranckingCacheService.getRank(adversaryB);
        if (!adversaryAPlayer || !adversaryBPlayer) {
            throw new Error('Player not found');
        }
        const K = 32;
        const WeA = 1 / (1 + Math.pow(10, (adversaryBPlayerRank - adversaryAPlayerRank) / 400));
        const WeB = 1 / (1 + Math.pow(10, (adversaryAPlayerRank - adversaryBPlayerRank) / 400));
        let result;
        let scoreA;
        let scoreB;
        if (draw) {
            scoreA = 0.5;
            scoreB = 0.5;
            result = 'Match was a draw';
        }
        else if (winner === adversaryA) {
            scoreA = 1;
            scoreB = 0;
            result = `Match processed: ${adversaryA} defeated ${adversaryB}`;
        }
        else if (winner === adversaryB) {
            scoreA = 0;
            scoreB = 1;
            result = `Match processed: ${adversaryB} defeated ${adversaryA}`;
        }
        else {
            throw new Error('Invalid match result');
        }
        const scoreFinalA = Math.round(adversaryAPlayerRank + K * (scoreA - WeA));
        const scoreFinalB = Math.round(adversaryBPlayerRank + K * (scoreB - WeB));
        this.ranckingCacheService.updateRank(adversaryA, scoreFinalA);
        this.ranckingCacheService.updateRank(adversaryB, scoreFinalB);
        return result;
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = MatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MatchService);
//# sourceMappingURL=match.service.js.map