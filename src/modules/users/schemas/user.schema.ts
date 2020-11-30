import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// export enum Roles {
//   User = 'user',
//   SuperAdmin = 'superAdmin',
//   Admin = 'admin',
// }

export type UserDocument = User & Document;
@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({
    type: String,
    unique: [true, 'THE_USERNAME_ALREADY_EXISTS'],
    required: true,
    minlength: 3,
    maxlength: 256,
    trim: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    select: false,
  })
  password: string;

  @Prop({ type: Boolean, default: false })
  isSuperAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  isStaff: boolean;

  @Prop({ type: Boolean, default: false, select: false })
  verified: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Role',
  })
  roles: Array<mongoose.Schema.Types.ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Encrypt the password and Empty the passwordConfirm field before saving
// *note: to work this middleware you should use save() instead of create()
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this['password'] = await bcrypt.hash(this['password'], 12);
  // this['passwordConfirm'] = undefined;
  next();
});

// validate the pass . If the method returned true,
// it means that the password entered is correct
UserSchema.methods.validatePassword = async function (
  candidatePass: string,
): Promise<Boolean> {
  return await bcrypt.compare(candidatePass, this['password']);
};
