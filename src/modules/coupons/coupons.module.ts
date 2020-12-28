import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Coupon, CouponSchema } from './schemas/coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Coupon.name,
        useFactory: () => {
          const schema = CouponSchema;
          return schema;
        },
      },
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
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
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
