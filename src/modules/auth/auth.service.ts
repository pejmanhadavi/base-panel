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
import { v4 as uuidv4 } from 'uuid';
import { getClientIp } from 'request-ip';
import { VerifyUuidDto } from './dto/verifyUuid.dto';
import global from '../../constants/global.constant';
import { RefreshToken, RefreshTokenDocument } from './schemas/refreshToken.schema';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { Request } from 'express';
import { ForgotPassword, ForgotPasswordDocument } from './schemas/forgotPassword.schema';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(ForgotPassword.name)
    private readonly forgotPasswordModel: Model<ForgotPasswordDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<string | object> {
    const { password, email, phoneNumber } = authSignUpDto;
    let findByEmail: UserDocument;
    let findByPhone: UserDocument;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    if (email) findByEmail = await this.userModel.findOne({ email });
    if (phoneNumber) findByPhone = await this.userModel.findOne({ phoneNumber });

    if (findByPhone || findByEmail)
      throw new BadRequestException('the user has already exists');

    const newUser = new this.userModel({
      phoneNumber,
      email,
      password,
    });
    await newUser.save();

    await this.setVerifyInfo(newUser);

    return { verificationCode: newUser.verificationCode };
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<object | void> {
    const { email, phoneNumber, password } = authSignInDto;

    // const user: any = await this.userModel
    //   .findOne({ email, phoneNumber })
    //   .select('+password +verified');

    const user: any = await this.userModel
      .findOne({ $or: [{ email }, { phoneNumber }] })
      .select('+password +verified');

    if (!user) throw new UnauthorizedException();

    if (!user.verified) throw new UnauthorizedException();

    const isPassCorrect = await user.validatePassword(password);

    if (!isPassCorrect) throw new UnauthorizedException();

    return { accessToken: this.generateAccessToken(user._id) };
  }

  // ROLES CRUD
  async getAllRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find({});
  }

  async getRoleById(id: string): Promise<any> {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('role was not found');
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument | string> {
    try {
      return await this.roleModel.create(createRoleDto);
    } catch (error) {
      if (error.code == 11000) throw new BadRequestException('This role already exists');
      if (error._message == 'Role validation failed')
        throw new BadRequestException('the permissions entered are invalid');
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDocument> {
    await this.getRoleById(id);

    return await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
    });
  }
  async deleteRole(id: string): Promise<string> {
    const role = await this.getRoleById(id);

    await role.deleteOne();

    return 'deleted successfully';
  }

  // verify email
  async verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto): Promise<object | void> {
    const { verificationCode } = verifyUuidDto;

    const filter = {
      verificationCode,
      verified: false,
      verificationExpires: { $gt: Date.now() },
    };

    const user = await this.findUser(filter);

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return {
      accessToken: this.generateAccessToken(user._id),
      refreshToken: await this.generateRefreshToken(req, user._id),
    };
  }
  // verify phone number
  async verifyPhoneNumber(
    req: Request,
    verifyUuidDto: VerifyUuidDto,
  ): Promise<object | void> {
    const { verificationCode } = verifyUuidDto;
    const filter = {
      verificationCode,
      verified: false,
      verificationExpires: { $gt: Date.now() },
    };

    const user = await this.findUser(filter);

    // set user as verified
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return {
      accessToken: this.generateAccessToken(user._id),
      refreshToken: await this.generateRefreshToken(req, user._id),
    };
  }

  // refresh access token
  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<any> {
    const user_id = await this.findRefreshToken(refreshAccessTokenDto.refreshToken);

    const user = await this.userModel.findById(user_id);
    if (!user) throw new UnauthorizedException();

    return { accessToken: this.generateAccessToken(user._id) };
  }

  // forgot password
  async forgotPassword(req: Request, forgotPasswordDto: ForgotPasswordDto) {
    const { email, phoneNumber } = forgotPasswordDto;
    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    const filter = { $or: [{ email }, { phoneNumber }] };
    const user = await this.findUser(filter);

    // create forgot password
    const forgotPassword = await this.createForgotPassword(req, user._id);

    return { forgotPassword };
  }

  // verify forgot password
  async forgotPasswordVerify(verifyUuidDto: VerifyUuidDto): Promise<string> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      forgotPasswordToken: verifyUuidDto.verificationCode,
      used: false,
      forgotPasswordExpires: { $gt: Date.now() },
    });
    if (!forgotPassword) throw new BadRequestException('the verify token is invalid');

    forgotPassword.used = true;
    await forgotPassword.save();

    return 'ok, please reset your password';
  }

  // reset password
  async resetPassword(passwordResetDto: PasswordResetDto) {
    const { email, phoneNumber, password } = passwordResetDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    const filter = { $or: [{ email }, { phoneNumber }], verified: true };
    const user = await this.findUser(filter);

    const forgotPassword = await this.forgotPasswordModel.findOne({
      user_id: user._id,
      used: true,
      forgotPasswordExpires: { $gt: Date.now() },
    });
    if (!forgotPassword) throw new BadRequestException('please verify again');

    user.password = password;
    await user.save();

    return 'Password changed successfully';
  }

  // ***************** private methods ********************

  private async findUser(filter: object): Promise<UserDocument> {
    const user = await this.userModel.findOne(filter);
    if (!user) throw new BadRequestException('bad request');
    return user;
  }

  // refresh token
  private async generateRefreshToken(req: Request, user_id: UserDocument): Promise<any> {
    const refreshToken = await this.refreshTokenModel.create({
      user_id,
      refreshToken: uuidv4(),
      ip: getClientIp(req),
      agent: req.headers['user-agent'] || 'XX',
    });
    return refreshToken.refreshToken;
  }

  private async createForgotPassword(req: Request, user_id: UserDocument) {
    const forgotPassword = await this.forgotPasswordModel.create({
      user_id,
      forgotPasswordToken: uuidv4(),
      forgotPasswordExpires: Date.now() + 1800000,
      ip: getClientIp(req),
      agent: req.headers['user-agent'] || 'XX',
      used: false,
    });

    return forgotPassword.forgotPasswordToken;
  }

  private async findRefreshToken(token: string): Promise<any> {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) throw new UnauthorizedException('user has been logged out.');

    return refreshToken.user_id;
  }

  private async setVerifyInfo(user: UserDocument): Promise<void> {
    user.verificationCode = uuidv4();
    user.verificationExpires = Date.now() + global.VERIFICATION_EXPIRES;
    await user.save();
  }

  private generateAccessToken(userId: string): Object {
    const payload: JwtPayload = {
      id: userId,
    };
    // generate access token
    const token = this.jwtService.sign(payload);
    return token;
  }
}
