import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthHistory,
  AuthHistorySchema,
} from '../modules/auth/schemas/authHistory.schema';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from '../modules/auth/schemas/forgotPassword.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../modules/auth/schemas/refreshToken.schema';
import { Role, RoleSchema } from '../modules/auth/schemas/role.schema';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { GenerateFakeDataService } from './generate-fake-data.service';
import { GenerateInitialDataService } from './generate-initial-data.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
      {
        name: Role.name,
        useFactory: () => {
          const schema = RoleSchema;
          return schema;
        },
      },
      {
        name: AuthHistory.name,
        useFactory: () => {
          const schema = AuthHistorySchema;
          return schema;
        },
      },
      {
        name: ForgotPassword.name,
        useFactory: () => {
          const schema = ForgotPasswordSchema;
          return schema;
        },
      },
      {
        name: RefreshToken.name,
        useFactory: () => {
          const schema = RefreshTokenSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [GenerateFakeDataService, GenerateInitialDataService],
  exports: [GenerateFakeDataService, GenerateInitialDataService],
})
export class GenerateDataModule {}
