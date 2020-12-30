import { Test, TestingModule } from '@nestjs/testing';
import { QsAsController } from './qs-as.controller';

describe('QsAsController', () => {
  let controller: QsAsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QsAsController],
    }).compile();

    controller = module.get<QsAsController>(QsAsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
