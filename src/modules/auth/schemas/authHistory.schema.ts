import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import permissions from '../../../constants/permissions.constant';

export type AuthHistoryDocument = AuthHistory & Document;
@Schema({ versionKey: false, timestamps: true })
export class AuthHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: Object.values(permissions),
    },
  })
  action: string;

  @Prop({ type: Date, required: true })
  date: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;
}

export const AuthHistorySchema = SchemaFactory.createForClass(AuthHistory);
