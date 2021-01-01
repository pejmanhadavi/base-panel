import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Category } from '../../categories/schemas/category.schema';

export type CouponDocument = Coupon & Document;

@Schema({ versionKey: false, timestamps: true })
export class Coupon {
  @Prop({ type: String, maxlength: 256, required: true })
  name: string;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ type: Number })
  usedCount?: number;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Product.name }],
    required: true,
  })
  products: Product[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name, index: true }],
    required: true,
  })
  categories: Category[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
