import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto';
import { User, UserDocument, UserSchema } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find(); //.select('+roles +verified');
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id); //.select('+roles +verified');
    if (!user) throw new NotFoundException('not found user by the given id');
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const { email, phoneNumber, password } = createUserDto;
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('username has already exists');
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.getUserById(id);

    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('username has already exists');
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);

    await user.deleteOne();
    return;
  }
}
