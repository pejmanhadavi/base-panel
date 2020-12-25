import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
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
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
