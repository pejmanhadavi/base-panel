import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmsDocument = Sms & Document;

@Schema({ versionKey: false, timestamps: true })
export class Sms {
  @Prop({
    type: String,
    maxlength: 13,
    required: true,
  })
  receptor: string;

  @Prop({
    type: Object,
    maxlength: 13,
    required: true,
  })
  data: Record<string, unknown>;

  @Prop({
    type: Boolean,
    default: false,
  })
  status: boolean;
}

export const SmsSchema = SchemaFactory.createForClass(Sms);
