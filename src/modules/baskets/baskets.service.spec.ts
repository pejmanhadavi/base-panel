import { Test, TestingModule } from '@nestjs/testing';
import { BasketsService } from './baskets.service';

describe('BasketsService', () => {
  let service: BasketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasketsService],
    }).compile();

    service = module.get<BasketsService>(BasketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
