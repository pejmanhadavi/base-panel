import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import * as faker from 'faker';
import { Role, RoleDocument } from '../modules/auth/schemas/role.schema';
import permissions from '../constants/permissions.constant';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../modules/auth/schemas/refreshToken.schema';
import {
  AuthHistory,
  AuthHistoryDocument,
} from '../modules/auth/schemas/authHistory.schema';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../modules/auth/schemas/forgotPassword.schema';

@Injectable()
export class GenerateFakeDataService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(AuthHistory.name)
    private authHistoryTokenModel: Model<AuthHistoryDocument>,
    @InjectModel(ForgotPassword.name)
    private forgotPasswordModel: Model<ForgotPasswordDocument>,
  ) {}

  // create fake user
  async createFakeUser(number = 5): Promise<UserDocument[]> {
    let i = 0;
    const users: UserDocument[] = [];
    for (; i < number; i++) {
      const user: UserDocument = await this.createSingleUser();
      users.push(user);
    }
    return users;
  }

  async createSingleUser(
    data = {
      email: faker.internet.email(),
      password: faker.internet.password(8),
      verified: true,
    },
  ): Promise<UserDocument> {
    const user: UserDocument = new this.userModel(data);
    await user.save();
    return user;
  }

  async createNotVerifiedUser(
    data = {
      email: faker.internet.email(),
      password: faker.internet.password(8),
      verified: false,
    },
  ): Promise<UserDocument> {
    const user: UserDocument = new this.userModel(data);
    await user.save();
    return user;
  }

  async createSingleRole(
    data = {
      name: faker.random.word(),
      permissions: [permissions.CREATE_USER, permissions.UPDATE_USER],
    },
  ): Promise<RoleDocument> {
    const role: RoleDocument = new this.roleModel(data);
    await role.save();
    return role;
  }

  async createSingleRefreshToken(
    user,
    data = {
      refreshToken: faker.random.word(),
      ip: faker.internet.ip(),
      agent: faker.internet.userAgent(),
    },
  ): Promise<RefreshTokenDocument> {
    const refreshToken: RefreshTokenDocument = new this.refreshTokenModel({
      user_id: user,
      ...data,
    });
    await refreshToken.save();
    return refreshToken;
  }

  async createSingleForgotPassword(
    data = {
      forgotPasswordToken: faker.random.word(),
      forgotPasswordExpires: faker.date.soon(1),
      ip: faker.internet.ip(),
      agent: faker.internet.userAgent(),
    },
  ): Promise<ForgotPasswordDocument> {
    const forgotPassword: ForgotPasswordDocument = new this.forgotPasswordModel(data);
    await forgotPassword.save();
    return forgotPassword;
  }

  async createSingleAuthHistory(
    data = {
      action: faker.random.word(),
      ip: faker.internet.ip(),
      agent: faker.internet.userAgent(),
    },
  ): Promise<AuthHistoryDocument> {
    const authHistory: AuthHistoryDocument = new this.authHistoryTokenModel(data);
    await authHistory.save();
    return authHistory;
  }
}
