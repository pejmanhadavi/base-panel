import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './schemas/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Banner.name,
        useFactory: () => {
          const schema = BannerSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
