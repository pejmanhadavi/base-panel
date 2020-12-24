import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthHistory, AuthHistorySchema } from './schemas/authHistory.schema';
import { ForgotPassword, ForgotPasswordSchema } from './schemas/forgotPassword.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refreshToken.schema';

dotenv.config();
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: +process.env.JWT_EXPIRES,
      },
    }),

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
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
