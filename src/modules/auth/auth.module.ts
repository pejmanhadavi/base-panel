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
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from './schemas/forgotPassword.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refreshToken.schema';

dotenv.config();
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 1800,
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: AuthHistory.name, schema: AuthHistorySchema },
      { name: ForgotPassword.name, schema: ForgotPasswordSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
