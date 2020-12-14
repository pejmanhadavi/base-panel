import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQueries } from '../../utils/filterQueries';
import { ObjectIdDto } from '../../common/dto/objectId.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(filterQueryDto: FilterQueryDto): Promise<User[]> {
    const filterQuery = new FilterQueries(this.userModel, filterQueryDto);

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
    const { email, phoneNumber } = createUserDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');
    try {
      let user = new this.userModel(createUserDto);

      user = await user.save();
      return user;
    } catch (error) {
      if (error.code == 11000) throw new BadRequestException('user has already exists');
      console.log(error);

      if (error.message.match(/Cast to ObjectId failed for value /))
        throw new BadRequestException('please enter valid roles');
    }
  }

  async updateUser(
    objectIdDto: ObjectIdDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.getUserById(objectIdDto);

    try {
      return await this.userModel.findByIdAndUpdate(objectIdDto, updateUserDto, {
        new: true,
      });
    } catch (error) {
      if (error.code == 11000) throw new BadRequestException('user has already exists');

      if (error.message.match(/Cast to ObjectId failed for value /))
        throw new BadRequestException('please enter valid roles');
    }
  }

  async deleteUser(objectIdDto: ObjectIdDto): Promise<void> {
    const user = await this.getUserById(objectIdDto);

    await user.deleteOne();
    return;
  }
}
