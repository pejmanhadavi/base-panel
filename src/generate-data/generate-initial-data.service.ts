import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';

@Injectable()
export class GenerateInitialDataService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.createSuperUserModel();
  }

  async createSuperUserModel(
    data: any = {
      email: 'superadmin@superadmin.me',
      password: '12345678',
      isSuperAdmin: true,
      verified: true,
      isActive: true,
      code: 1,
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
