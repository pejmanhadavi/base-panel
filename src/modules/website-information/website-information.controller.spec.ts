import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteInformationController } from './website-information.controller';
import { WebsiteInformationService } from './website-information.service';

describe('WebsiteInformationController', () => {
  let controller: WebsiteInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteInformationController],
      providers: [WebsiteInformationService],
    }).compile();

    controller = module.get<WebsiteInformationController>(WebsiteInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
