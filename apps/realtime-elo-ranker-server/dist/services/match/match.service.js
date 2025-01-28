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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const PlayerEntity_1 = require("../../data/model/PlayerEntity");
const ranking_cache_service_1 = require("../ranking-cache/ranking-cache.service");
let MatchService = class MatchService {
    constructor(playerRepository, rankingCacheService) {
        this.playerRepository = playerRepository;
        this.rankingCacheService = rankingCacheService;
    }
    async processMatch(body) {
        const { adversaryA, adversaryB, winner, draw } = body;
        const adversaryAPlayer = await this.playerRepository.findOne({ where: { name: adversaryA } });
        const adversaryBPlayer = await this.playerRepository.findOne({ where: { name: adversaryB } });
        console.log(adversaryAPlayer, adversaryBPlayer);
        if (!adversaryAPlayer || !adversaryBPlayer) {
            throw new Error('One or both players not found');
        }
        const adversaryAPlayerRank = adversaryAPlayer.rank;
        const adversaryBPlayerRank = adversaryBPlayer.rank;
        const K = 32;
        const WeA = 1 / (1 + Math.pow(10, (adversaryBPlayerRank - adversaryAPlayerRank) / 400));
        const WeB = 1 / (1 + Math.pow(10, (adversaryAPlayerRank - adversaryBPlayerRank) / 400));
        let scoreA = 0.5;
        let scoreB = 0.5;
        let result = 'Match drawn';
        if (!draw) {
            if (winner === adversaryA) {
                scoreA = 1;
                scoreB = 0;
                result = `${adversaryA} defeated ${adversaryB}`;
            }
            else if (winner === adversaryB) {
                scoreA = 0;
                scoreB = 1;
                result = `${adversaryB} defeated ${adversaryA}`;
            }
            else {
                throw new Error('Invalid match result');
            }
        }
        const scoreFinalA = Math.round(adversaryAPlayerRank + K * (scoreA - WeA));
        const scoreFinalB = Math.round(adversaryBPlayerRank + K * (scoreB - WeB));
        await this.rankingCacheService.updateRank(adversaryA, scoreFinalA);
        await this.rankingCacheService.updateRank(adversaryB, scoreFinalB);
        return result;
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(PlayerEntity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ranking_cache_service_1.RankingCacheService])
], MatchService);
//# sourceMappingURL=match.service.js.map