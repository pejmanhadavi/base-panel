import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class GenerateInitialDataService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createSuperUserModel(
    data: any = {
      email: 'superadmin@superadmin.me',
      password: '12345678',
      isSuperAdmin: true,
    },
  ): Promise<UserDocument> {
    const users = await this.userModel.find();
    if (!users.length) {
      const user: UserDocument = await this.userModel.create(data);
      Logger.verbose(
        'super user created. <!! change email and password as soon as you can !!>',
      );
      return user;
    }
  }
}