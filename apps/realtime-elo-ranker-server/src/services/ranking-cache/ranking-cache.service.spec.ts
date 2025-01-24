import { Test, TestingModule } from '@nestjs/testing';
import { RankingCacheService } from './ranking-cache.service';

describe('RankingCacheService', () => {
  let service: RankingCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
         {
          provide : RankingCacheService,
          useValue: RankingCacheService.getInstance(),
         },
      ],
    }).compile();

    service = module.get<RankingCacheService>(RankingCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
