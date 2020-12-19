import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteInformationService } from './website-information.service';

describe('WebsiteInformationService', () => {
  let service: WebsiteInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteInformationService],
    }).compile();

    service = module.get<WebsiteInformationService>(WebsiteInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
