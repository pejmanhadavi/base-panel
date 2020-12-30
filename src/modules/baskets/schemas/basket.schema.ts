import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { Coupon } from 'src/modules/coupons/schemas/coupon.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import shippingMethods from 'src/constants/shipping-methods.constant';

export type BasketDocument = Basket & Document;

@Schema({ versionKey: false, timestamps: true })
export class Basket {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Product.name }],
    required: true,
  })
  products: Product[];

  @Prop({ type: mongoose.Types.ObjectId, ref: Coupon.name })
  coupon?: Coupon;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ type: Number, default: 0 })
  discount?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: String, enum: Object.values(shippingMethods), required: true })
  shippingMethod: string;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
