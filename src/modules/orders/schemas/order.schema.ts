import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import orderStatues from 'src/constants/order-statues.constant';
import { Payment } from 'src/modules/payments/schemas/payment.schema';

export type OrderDocument = Order & Document;

@Schema({ versionKey: false, timestamps: true })
export class Order {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Product.name }],
  })
  products: Product[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: String, enum: Object.values(orderStatues) })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Payment.name, required: true })
  Payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
