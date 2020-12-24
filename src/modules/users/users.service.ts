import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQueries } from '../../utils/filterQueries';
import { ObjectIdDto } from '../../common/dto/objectId.dto';
import { ui_query_projection_fields } from './users.projection';
import { Role, RoleDocument } from '../auth/schemas/role.schema';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAllUsers(filterQueryDto: FilterQueryDto): Promise<User[]> {
    const filterQuery = new FilterQueries(
      this.userModel,
      filterQueryDto,
      ui_query_projection_fields,
    );

    filterQuery.filter().limitFields().paginate().sort();

    const users = await filterQuery.query.populate('roles', 'name permissions');
    return users;
  }

  async getUserById(objectIdDto: ObjectIdDto): Promise<UserDocument> {
    const user = await this.userModel
      .findById(objectIdDto.id)
      .populate('roles', 'name permissions');
    if (!user) throw new NotFoundException('not found user by the given id');
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, phoneNumber, roles } = createUserDto;
    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    await this.checkUserExistence(email, phoneNumber);

    if (roles && roles.length) await this.doesRolesExist(createUserDto.roles);

    this.checkSuperAdmin(this.request.user, createUserDto);

    return await this.adminLogService.create(
      this.request.user,
      this.userModel,
      createUserDto,
    );
  }

  async updateUser(
    objectIdDto: ObjectIdDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const { roles } = updateUserDto;
    await this.checkUserExistence(updateUserDto.email, updateUserDto.phoneNumber);

    if (roles && roles.length) await this.doesRolesExist(updateUserDto.roles);
    console.log(updateUserDto);

    this.checkSuperAdmin(this.request.user, updateUserDto);

    console.log(updateUserDto);
    return await this.adminLogService.update(
      this.request.user,
      this.userModel,
      objectIdDto.id,
      updateUserDto,
    );
  }

  async deleteUser(objectIdDto: ObjectIdDto): Promise<void> {
    return await this.adminLogService.delete(
      this.request.user,
      this.userModel,
      objectIdDto.id,
    );
  }

  // private methods
  private async checkUserExistence(email?: string, phoneNumber?: string) {
    let user;

    if (email)
      user = await this.userModel.findOne({ email, verified: true, isActive: true });

    if (phoneNumber)
      user = await this.userModel.findOne({
        phoneNumber,
        verified: true,
        isActive: true,
      });

    if (user) throw new BadRequestException('the user has already exists');
  }

  private async doesRolesExist(roles) {
    for (const role of roles) {
      if (!(await this.roleModel.exists({ _id: role })))
        throw new BadRequestException('the entered roles are invalid');
    }
  }

  private checkSuperAdmin(user, userDto) {
    if (user.isSuperAdmin) return;

    delete userDto.isSuperAdmin;
    delete userDto.isStaff;
    delete userDto.roles;
  }
}
