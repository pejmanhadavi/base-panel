import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import adminLogs from 'src/constants/admin-logs.constant';

export type AdminLogDocument = AdminLog & Document;

@Schema({ versionKey: false, timestamps: true })
export class AdminLog {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({
    type: String,
    required: true,
  })
  model: string;

  @Prop({
    type: Number,
    required: true,
  })
  code: number;

  @Prop({
    type: String,
    enum: Object.values(adminLogs),
    required: true,
    index: true,
  })
  action: string;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
