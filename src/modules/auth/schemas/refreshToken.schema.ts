import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;
@Schema({ versionKey: false, timestamps: true })
export class RefreshToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;

  @Prop({ type: String, required: true })
  country: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
