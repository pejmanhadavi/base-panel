import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Brand } from '../../brands/schemas/brand.schema';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false, timestamps: true })
export class Product {
  @Prop({ type: String, maxlength: 256, index: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, required: true })
  category: Category;

  @Prop({ type: [String], index: true })
  pictures?: [string];

  @Prop({ type: String, index: true })
  thumbnail?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Brand.name, required: true })
  brand: Brand;

  @Prop({ type: Number, min: 0, max: 5, default: 3 })
  stars: number;

  @Prop({ type: Date })
  specialOfferExpires?: Date;

  @Prop({ type: Boolean, default: true })
  forWholeCountry: boolean;

  @Prop({ type: Number, default: 1 })
  maxDeliveryDays: number;

  @Prop({ type: [String] })
  colors?: Array<string>;

  @Prop({ type: [String] })
  sizes?: Array<string>;

  @Prop({ type: Number })
  remainingNumber?: number;

  @Prop({ type: String, required: false })
  review?: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  discount?: number;

  @Prop({ type: Number, default: 0 })
  visits?: number;

  @Prop({ type: Number })
  weight?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
