import { Module } from '@nestjs/common';
import { WebsiteInformationService } from './website-information.service';
import { WebsiteInformationController } from './website-information.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WebsiteInformation,
  WebsiteInformationSchema,
} from './schemas/website-information.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: WebsiteInformation.name,
        useFactory: () => {
          const schema = WebsiteInformationSchema;
          return schema;
        },
      },
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [WebsiteInformationController],
  providers: [WebsiteInformationService],
})
export class WebsiteInformationModule {}
