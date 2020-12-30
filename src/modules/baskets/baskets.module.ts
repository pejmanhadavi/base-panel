import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BasketsController } from './baskets.controller';
import { BasketsService } from './baskets.service';
import { Basket, BasketSchema } from './schemas/basket.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Basket.name,
        useFactory: () => {
          const schema = BasketSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [BasketsController],
  providers: [BasketsService],
})
export class BasketsModule {}
