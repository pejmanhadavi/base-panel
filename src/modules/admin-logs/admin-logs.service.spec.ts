import { Test, TestingModule } from '@nestjs/testing';
import { AdminLogsService } from './admin-logs.service';

describe('AdminLogsService', () => {
  let service: AdminLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminLogsService],
    }).compile();

    service = module.get<AdminLogsService>(AdminLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
