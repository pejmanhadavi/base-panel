import { UserDocument } from './schemas/user.schema';

export const ui_query_projection_fields: Partial<UserDocument> = {
  _id: 1 as any,
  email: 1 as any,
  phoneNumber: 1 as any,
  roles: 1 as any,
};
