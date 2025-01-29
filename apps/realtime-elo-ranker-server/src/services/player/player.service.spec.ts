import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerService } from './player.service';
import { Player } from '../../data/model/PlayerEntity';
import { RankingCacheService } from '../ranking-cache/ranking-cache.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;
  let rankingCacheService: RankingCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        RankingCacheService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
    rankingCacheService = module.get<RankingCacheService>(RankingCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPlayer', () => {
    it('should add a player', async () => {
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({} as Player);
      await service.addPlayer('player1', 1000);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'player1', rank: 1000 }));
    });
  });

  describe('getPlayer', () => {
    it('should get a player by id', async () => {
      const player = { id: 1, name: 'player1', rank: 1000 } as Player;
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(player);
      const result = await service.getPlayer(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(player);
    });

    it('should return undefined if player not found', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.getPlayer(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeUndefined();
    });
  });

  describe('getAllPlayers', () => {
    it('should get all players', async () => {
      const players = [{ id: 1, name: 'player1', rank: 1000 }] as Player[];
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue(players);
      const result = await service.getAllPlayers();
      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(players);
    });
  });

  describe('updatePlayer', () => {
    it('should update a player\'s rank', async () => {
      const player = { id: 1, name: 'player1', rank: 1000 } as Player;
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(player);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(player);
      await service.updatePlayer(1, 1500);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 1, rank: 1500 }));
    });

    it('should not update if player not found', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const saveSpy = jest.spyOn(repository, 'save');
      await service.updatePlayer(1, 1500);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});