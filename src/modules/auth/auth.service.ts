import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<string | void> {
    const { password, email, phoneNumber } = authSignUpDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    try {
      let user = new this.userModel({
        phoneNumber,
        email,
        password,
      });
      user = await user.save();

      return 'User successfully registered';
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('user has already exists');
    }
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<object | void> {
    const { email, phoneNumber, password } = authSignInDto;

    const user: any = await this.userModel
      .findOne({ email, phoneNumber })
      .select('+password');

    if (!user) throw new UnauthorizedException();

    const isPassCorrect = await user.validatePassword(password);

    if (!isPassCorrect) throw new UnauthorizedException();

    // declare payload to jwt
    const payload: JwtPayload = {
      id: user._id,
    };
    // generate token
    const token = this.jwtService.sign(payload);
    return { token };
  }

  // ROLES CRUD
  async getAllRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find({});
  }

  async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<RoleDocument | string> {
    try {
      const role = new this.roleModel(createRoleDto);
      return await role.save();
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('This role already exists');
      if (error._message == 'Role validation failed')
        throw new BadRequestException('the role entered is invalid');
    }
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('role was not found');
    return await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
    });
  }
  async deleteRole(id: string): Promise<string> {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('role was not found');
    await role.deleteOne();
    return 'delete successfully';
  }
}
