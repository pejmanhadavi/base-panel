import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false, timestamps: true })
export class Category {
  @Prop({
    type: String,
    maxlength: 1024,
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  thumbnail: string;

  @Prop({
    type: String,
    required: true,
  })
  picture: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    index: true,
  })
  parent?: Category;

  @Prop({
    type: [{ type: String }],
    required: true,
    index: true,
  })
  properties: Array<string>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
