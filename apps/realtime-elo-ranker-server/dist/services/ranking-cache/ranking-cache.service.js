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
var RankingCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingCacheService = void 0;
const common_1 = require("@nestjs/common");
const player_data_1 = require("../../data/player.data");
let RankingCacheService = RankingCacheService_1 = class RankingCacheService {
    constructor() {
        this.cache = new Map();
        const fakeRanking = player_data_1.FAKE_PLAYERS.map((player, index) => ({
            id: player,
            rank: 1000 + index * 10
        })).sort((a, b) => b.rank - a.rank);
        this.cache.set('ranking', fakeRanking);
    }
    static getInstance() {
        if (!RankingCacheService_1.instance) {
            RankingCacheService_1.instance = new RankingCacheService_1();
        }
        return RankingCacheService_1.instance;
    }
    setRankingData(key, data) {
        const ranking = this.cache.get("ranking") || [];
        ranking.push({ id: key, rank: data });
        this.cache.set("ranking", ranking);
    }
    getRankingData(key) {
        return this.cache.get(key);
    }
    getId(key) {
        const ranking = this.cache.get("ranking") || [];
        for (const playerData of ranking) {
            if (playerData.id === key) {
                return playerData.id;
            }
        }
        return undefined;
    }
    getRank(key) {
        const ranking = this.cache.get("ranking") || [];
        for (const playerData of ranking) {
            if (playerData.id === key) {
                return playerData.rank;
            }
        }
        return undefined;
    }
    updateRank(player, newRank) {
        const ranking = this.cache.get('ranking') || [];
        const playerIndex = ranking.findIndex((p) => p.id === player);
        if (playerIndex !== -1) {
            ranking[playerIndex].rank = newRank;
            this.cache.set('ranking', ranking.sort((a, b) => b.rank - a.rank));
        }
    }
    clearRankingData(key) {
        this.cache.delete(key);
    }
    clearAllRankingData() {
        this.cache.clear();
    }
    getAverageRanking() {
        const ranking = this.cache.get('ranking') || [];
        if (ranking.length === 0) {
            return 0;
        }
        const total = ranking.reduce((acc, player) => acc + player.rank, 0);
        return total / ranking.length;
    }
};
exports.RankingCacheService = RankingCacheService;
exports.RankingCacheService = RankingCacheService = RankingCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RankingCacheService);
//# sourceMappingURL=ranking-cache.service.js.map