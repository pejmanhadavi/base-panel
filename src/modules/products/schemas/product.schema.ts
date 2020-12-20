import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema';
import { Brand } from './brand.schema';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false, timestamps: true })
export class Product {
  @Prop({ type: String, maxlength: 256, index: true })
  title: string;

  @Prop({ type: String, required: true, index: true })
  thumbnail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, index: true })
  homeCategories: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Brand.name })
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
  colors?: string[];

  @Prop({ type: [String] })
  sizes?: string[];

  @Prop({ type: Number })
  remainingNumber?: number;

  @Prop({ type: String, required: true })
  review: string;

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop({ type: Number })
  discount?: number;

  @Prop({ type: Number, default: 0 })
  visits: number;

  @Prop({ type: Number })
  weight?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
