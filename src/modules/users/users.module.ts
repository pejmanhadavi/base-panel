import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre('save', async function (next) {
            if (!this.isModified('password')) return next();
            this['password'] = await bcrypt.hash(this['password'], 12);
            next();
          });

          schema.methods.validatePassword = async function (
            candidatePass: string,
          ): Promise<Boolean> {
            return await bcrypt.compare(candidatePass, this['password']);
          };

          return schema;
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
