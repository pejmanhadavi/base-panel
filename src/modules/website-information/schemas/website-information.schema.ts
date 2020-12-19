import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema';

export type WebsiteInformationDocument = WebsiteInformation & Document;

@Schema({ versionKey: false, timestamps: true })
export class WebsiteInformation {
  // main information
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
  logo: string;

  @Prop({ type: [{ type: String, index: true }] })
  homeSliderImages: Array<string>;

  @Prop({ type: [{ type: String, index: true }] })
  homeEndImages: Array<string>;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  blogPicture: string;

  // categories in home page
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name, index: true }],
  })
  homeCategories: Category[];

  // social network links
  @Prop({
    type: String,
    maxlength: 1024,
  })
  instagramLink?: string;

  @Prop({
    type: String,
    maxlength: 1024,
  })
  twitterLink?: string;

  @Prop({
    type: String,
    maxlength: 1024,
  })
  linkedinLink?: string;

  // products in home page
  @Prop({
    type: Boolean,
    default: false,
  })
  newest?: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  mostDiscounts?: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  mostSales?: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  specialOffers?: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  mostVisited?: boolean;

  @Prop({ type: [{ type: String, minlength: 5, maxlength: 256, trim: true }] })
  newsLetterEmails?: Array<string>;

  @Prop({ type: Array, validate: [arrayLimit, '{PATH} exceeds the limit of 4'] })
  Advantages: [];
}

export const WebsiteInformationSchema = SchemaFactory.createForClass(WebsiteInformation);

function arrayLimit(val) {
  return val.length <= 4;
}
