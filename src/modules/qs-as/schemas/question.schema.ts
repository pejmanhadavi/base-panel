import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type QuestionDocument = Question & Document;

@Schema({ versionKey: false, timestamps: true })
export class Question {
  @Prop({ type: String, maxlength: 1024, required: true })
  body: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: Product.name, required: true })
  product: Product;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: Boolean, default: false })
  published: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
