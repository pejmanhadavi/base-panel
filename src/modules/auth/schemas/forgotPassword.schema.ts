import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import permissions from '../../../constants/permissions.constant';

export type ForgotPasswordDocument = ForgotPassword & Document;
@Schema({ versionKey: false, timestamps: true })
export class ForgotPassword {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  forgotPasswordToken: string;

  @Prop({ type: Date })
  forgotPasswordExpires: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(
  ForgotPassword,
);
