import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ versionKey: false, timestamps: true })
export class Brand {
  @Prop({ type: String, maxlength: 256 })
  name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  thumbnail: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
