import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';
import * as mongoose from 'mongoose';
import { Payment } from 'src/modules/payments/schemas/payment.schema';
import transactionStatuses from 'src/constants/transaction-statuses.constant';

export type TransactionDocument = Transaction & Document;

@Schema({ versionKey: false, timestamps: true })
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name, required: true })
  order: Order;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Payment.name, required: true })
  payment: Payment;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Transaction.name,
    index: true,
  })
  transaction: Transaction;

  @Prop({ type: String, enum: Object.values(transactionStatuses) })
  ilk: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
