import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import * as faker from 'faker';
import { Role, RoleDocument } from '../modules/auth/schemas/role.schema';
import permissions from '../constants/permissions.constant';
@Injectable()
export class GenerateFakeDataService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
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
}
