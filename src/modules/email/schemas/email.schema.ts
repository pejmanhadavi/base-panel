import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema({ versionKey: false, timestamps: true })
export class Email {
  @Prop({ type: String, minlength: 5, maxlength: 256, trim: true })
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

export const EmailSchema = SchemaFactory.createForClass(Email);
