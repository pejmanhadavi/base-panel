import { Test, TestingModule } from '@nestjs/testing';
import { AdminLogsController } from './admin-logs.controller';

describe('AdminLogsController', () => {
  let controller: AdminLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminLogsController],
    }).compile();

    controller = module.get<AdminLogsController>(AdminLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
