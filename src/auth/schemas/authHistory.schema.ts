import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import authActions from '../../constants/auth-actions.constant';
import { User } from '../../users/schemas/user.schema';

export type AuthHistoryDocument = AuthHistory & Document;
@Schema({ versionKey: false, timestamps: true })
export class AuthHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: User;

  @Prop({
    type: String,
    enum: Object.values(authActions),
    required: true,
  })
  action: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;
}

export const AuthHistorySchema = SchemaFactory.createForClass(AuthHistory);
