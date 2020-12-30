import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../auth/schemas/role.schema';
import { Product } from '../../products/schemas/product.schema';

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

  @Prop({ type: String })
  avatar?: string;

  @Prop({ type: String, maxlength: 256 })
  fullName?: string;

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

  @Prop({ type: Number })
  verificationCode: number;

  @Prop({ type: Date })
  verificationExpires: Date;

  @Prop({ type: Number, default: 0 })
  confirmationAttemptsCount: number;

  @Prop({ type: Date })
  blockExpires: Date;

  @Prop({ type: String, maxlength: 32 })
  nationalCode?: string;

  @Prop({
    type: [{ type: Object }],
  })
  addresses: [];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Product.name }],
  })
  wishLists?: Product[];

  @Prop({ type: Number, default: 0 })
  credit?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this['password'] = await bcrypt.hash(this['password'], 12);
  next();
});

UserSchema.methods.validatePassword = async function (
  candidatePass: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePass, this['password']);
};
