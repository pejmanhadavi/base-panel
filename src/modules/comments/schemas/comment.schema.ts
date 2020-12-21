import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: String, maxlength: 1024 })
  body: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: Product.name })
  product: Product;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: Boolean, default: false })
  published: boolean;

  @Prop({ type: Number, min: 0, max: 5 })
  stars: number;

  @Prop({ type: Number, min: 0, max: 5 })
  quality: number;

  @Prop({ type: Number, min: 0, max: 5 })
  value: number;

  @Prop({ type: Number, min: 0, max: 5 })
  innovation: number;

  @Prop({ type: Number, min: 0, max: 5 })
  facilities: number;

  @Prop({ type: Number, min: 0, max: 5 })
  easeOfUse: number;

  @Prop({ type: Number, min: 0, max: 5 })
  design: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
