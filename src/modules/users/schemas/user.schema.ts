import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../../auth/schemas/role.schema';

export type UserDocument = User & Document;
@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({
    type: String,
    minlength: 5,
    maxlength: 256,
    trim: true,
  })
  email?: string;

  @Prop({
    type: String,
    minlength: 11,
    maxlength: 11,
    trim: true,
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    select: false,
  })
  password: string;

  @Prop({ type: Boolean, default: false, select: false })
  isSuperAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  isStaff: boolean;

  @Prop({ type: Boolean, default: true, select: false })
  isActive: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name, index: true }] })
  roles: Role[];

  @Prop({ type: Boolean, default: false, select: false })
  verified: boolean;

  @Prop({ type: String })
  verificationCode: string;

  @Prop({ type: Date })
  verificationExpires: Date;

  @Prop({ type: Number, default: 0 })
  confirmationAttemptsCount: number;

  @Prop({ type: Date })
  blockExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
