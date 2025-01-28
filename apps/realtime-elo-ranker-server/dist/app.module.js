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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ranking_cache_service_1 = require("./services/ranking-cache/ranking-cache.service");
const player_service_1 = require("./services/player/player.service");
const match_service_1 = require("./services/match/match.service");
const PlayerEntity_1 = require("./data/model/PlayerEntity");
const player_data_1 = require("./data/player.data");
const typeorm_2 = require("typeorm");
let AppModule = class AppModule {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async onModuleInit() {
        await this.addFakePlayers();
    }
    async addFakePlayers() {
        if (await this.playerRepository.count() === 0) {
            const fakeRanking = player_data_1.FAKE_PLAYERS.map((player, index) => ({
                id: player,
                rank: 1000 + index * 10,
            })).sort((a, b) => b.rank - a.rank);
            const players = fakeRanking.map(ranking => {
                const player = new PlayerEntity_1.Player();
                player.name = ranking.id;
                player.rank = ranking.rank;
                return player;
            });
            await this.playerRepository.save(players);
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                entities: [PlayerEntity_1.Player],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([PlayerEntity_1.Player]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, player_service_1.PlayerService, ranking_cache_service_1.RankingCacheService, match_service_1.MatchService],
    }),
    __param(0, (0, typeorm_1.InjectRepository)(PlayerEntity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppModule);
//# sourceMappingURL=app.module.js.map