import { Injectable, OnModuleInit } from '@nestjs/common';
import { GenerateInitialDataService } from './generate-data/generate-initial-data.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly generateInitialDataService: GenerateInitialDataService) {}
  async onModuleInit() {
    await this.generateInitialDataService.createSuperUserModel();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
