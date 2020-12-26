import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand, BrandSchema } from './schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Brand.name,
        useFactory: () => {
          const schema = BrandSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
