import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ForgotPasswordDocument = ForgotPassword & Document;
@Schema({ versionKey: false, timestamps: true })
export class ForgotPassword {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  forgotPasswordToken: string;

  @Prop({ type: Date, required: true })
  forgotPasswordExpires: number;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  agent: string;

  @Prop({ type: Boolean, default: false })
  used: boolean;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(
  ForgotPassword,
);
