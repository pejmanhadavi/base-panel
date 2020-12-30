import { Test, TestingModule } from '@nestjs/testing';
import { QsAsService } from './qs-as.service';

describe('QsAsService', () => {
  let service: QsAsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QsAsService],
    }).compile();

    service = module.get<QsAsService>(QsAsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
