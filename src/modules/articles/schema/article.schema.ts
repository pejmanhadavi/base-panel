import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ArticleDocument = Article & Document;

@Schema({ versionKey: false, timestamps: true })
export class Article {
  @Prop({
    type: String,
    maxlength: 256,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    maxlength: 1024,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: false,
    index: true,
  })
  thumbnail?: string;

  @Prop({
    type: String,
    required: true,
  })
  body: string;

  @Prop({
    type: Number,
    default: 0,
  })
  visits?: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  published?: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
