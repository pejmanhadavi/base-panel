import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Question } from './question.schema';

export type AnswerDocument = Answer & Document;

@Schema({ versionKey: false, timestamps: true })
export class Answer {
  @Prop({ type: String, maxlength: 1024 })
  body: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: Question.name })
  question: Question;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  user: User; // Admin user

  @Prop({ type: Boolean, default: false })
  published: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
