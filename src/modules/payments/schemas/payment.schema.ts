import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import paymentStatuses from 'src/constants/payment-statuses.constant';
import paymentMethods from 'src/constants/payment-methods.constant';

export type PaymentDocument = Payment & Document;

@Schema({ versionKey: false, timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: String, enum: Object.values(paymentStatuses) })
  status: string;

  @Prop({ type: String, enum: Object.values(paymentMethods) })
  method: string;

  @Prop({ type: Number, required: true, default: 0 })
  amount: number;

  @Prop({ type: Object, required: true })
  paymentInformation: Record<string, unknown>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
