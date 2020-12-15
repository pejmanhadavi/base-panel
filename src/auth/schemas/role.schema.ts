import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import permissions from '../../constants/permissions.constant';

export type RoleDocument = Role & Document;
@Schema({ versionKey: false, timestamps: true })
export class Role {
  @Prop({
    type: String,
    unique: [true, 'THE_ROLE_ALREADY_EXISTS'],
    required: true,
    minlength: 3,
    maxlength: 256,
    trim: true,
    index: true,
  })
  name: string;

  @Prop({
    type: [{ type: String }],
    enum: Object.values(permissions),
    required: true,
    index: true,
  })
  permissions: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
