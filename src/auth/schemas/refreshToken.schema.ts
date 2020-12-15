import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type RefreshTokenDocument = RefreshToken & Document;
@Schema({ versionKey: false, timestamps: true })
export class RefreshToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: User;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
