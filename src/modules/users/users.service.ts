import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
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

    try {
      let user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      if (error.message.match(/Cast to ObjectId failed for value /))
        throw new BadRequestException('please enter valid roles');
    }
  }

  async updateUser(
    objectIdDto: ObjectIdDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.getUserById(objectIdDto);

    await this.checkUserExistence(updateUserDto.email, updateUserDto.phoneNumber);

    try {
      return await this.userModel.findByIdAndUpdate(objectIdDto.id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      if (error.message.match(/Cast to ObjectId failed for value /))
        throw new BadRequestException('please enter valid roles');
    }
  }

  async deleteUser(objectIdDto: ObjectIdDto): Promise<void> {
    const user = await this.getUserById(objectIdDto);

    await user.deleteOne();
    return;
  }

  // private methods
  private async checkUserExistence(email?: string, phoneNumber?: string) {
    let user;
    if (email) user = await this.userModel.findOne({ email });
    if (phoneNumber) user = await this.userModel.findOne({ phoneNumber });

    if (user) throw new BadRequestException('the user has already exists');
  }
}
