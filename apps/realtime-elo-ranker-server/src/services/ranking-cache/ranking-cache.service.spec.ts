import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingCacheService } from './ranking-cache.service';
import { Player } from '../../data/model/PlayerEntity';

describe('RankingCacheService', () => {
  let service: RankingCacheService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingCacheService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RankingCacheService>(RankingCacheService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setRankingData', () => {
    it('should set ranking data', async () => {
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({} as Player);
      await service.setRankingData('player1', 1000);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'player1', rank: 1000 }));
    });
  });

  describe('getRankingData', () => {
    it('should get ranking data', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([{ name: 'player1', rank: 1000 }] as Player[]);
      const result = await service.getRankingData();
      expect(findSpy).toHaveBeenCalledWith({ order: { rank: 'DESC' } });
      expect(result).toEqual([{ name: 'player1', rank: 1000 }]);
    });
  });

  describe('getAverageRanking', () => {
    it('should get average ranking', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([{ name: 'player1', rank: 1000 }, { name: 'player2', rank: 2000 }] as Player[]);
      const result = await service.getAverageRanking();
      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(1500);
    });

    it('should return 0 if no players', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([] as Player[]);
      const result = await service.getAverageRanking();
      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(0);
    });
  });

  describe('updateRank', () => {
    it('should update rank', async () => {
      const player = { name: 'player1', rank: 1000 } as Player;
      const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValue(player);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(player);
      await service.updateRank('player1', 1500);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { name: 'player1' } });
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'player1', rank: 1500 }));
    });
  });
});