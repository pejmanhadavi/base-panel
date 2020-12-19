import { Module } from '@nestjs/common';
import { WebsiteInformationService } from './website-information.service';
import { WebsiteInformationController } from './website-information.controller';

@Module({
  controllers: [WebsiteInformationController],
  providers: [WebsiteInformationService]
})
export class WebsiteInformationModule {}
