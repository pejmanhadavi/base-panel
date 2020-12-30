import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import platforms from '../../../constants/platforms.constant';

export type BannerDocument = Banner & Document;

@Schema({ versionKey: false, timestamps: true })
export class Banner {
  @Prop({
    type: String,
    maxlength: 256,
    required: true,
  })
  name: string;

  @Prop({
    type: [{ type: String }],
    enum: Object.values(platforms),
    required: true,
  })
  platforms: Array<string>;

  @Prop({
    type: Boolean,
    default: false,
  })
  status?: boolean;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  link: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
