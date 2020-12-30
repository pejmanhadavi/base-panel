import {
  BadRequestException,
  Inject,
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
import global from '../../constants/globals.constant';
import { RefreshToken, RefreshTokenDocument } from './schemas/refreshToken.schema';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { Request } from 'express';
import { ForgotPassword, ForgotPasswordDocument } from './schemas/forgotPassword.schema';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { AuthHistory, AuthHistoryDocument } from './schemas/authHistory.schema';
import authActions from '../../constants/auth-actions.constant';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { VerifyPhoneNumberDto } from './dto/verifyPhoneNumber.dto';
import { ObjectIdDto } from '../../common/dto/objectId.dto';
import { addHours, addMinutes } from 'date-fns';
import { ChangeMyPasswordDto } from './dto/changeMyPassword.dto';
import { ChangeMyInfoDto } from './dto/changeMyInfo.dto';
import mainPermissions from '../../constants/permissions.constant';
import { el } from 'date-fns/locale';
import { VerifyForgotPasswordDto } from './dto/verifyForgotPassword.dto';
import { REQUEST } from '@nestjs/core';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(ForgotPassword.name)
    private readonly forgotPasswordModel: Model<ForgotPasswordDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(AuthHistory.name)
    private readonly authHistoryModel: Model<AuthHistoryDocument>,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<{ verificationCode: number }> {
    const { password, email, phoneNumber } = authSignUpDto;

    await this.checkUserExistence(authSignUpDto);

    const newUser = new this.userModel({ phoneNumber, email, password });

    await newUser.save();

    await this.setVerifyInfo(newUser);

    this.createAuthHistory(newUser._id, authActions.SIGN_UP);

    return { verificationCode: newUser.verificationCode };
  }

  async signIn(
    authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUserInput(authSignInDto);
    this.createAuthHistory(user._id, authActions.SIGN_IN);

    return {
      accessToken: this.generateAccessToken(user._id),
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  // ROLES CRUD
  async getAllRoles(filterQueryDto: FilterQueryDto): Promise<Role[]> {
    const filterQuery = new FilterQueries(this.roleModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    return await filterQuery.query;
  }

  async getRoleById(code: number): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ code });

    if (!role) throw new NotFoundException('the role not found');

    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const { name, permissions } = createRoleDto;

    await this.checkRoleExistence(name);

    this.checkPermissions(permissions);

    return await this.roleModel.create(createRoleDto);
  }

  async updateRole(code: number, updateRoleDto: UpdateRoleDto): Promise<RoleDocument> {
    await this.getRoleById(code);

    if (updateRoleDto.name) await this.checkRoleExistence(updateRoleDto.name);

    if (updateRoleDto.permissions) this.checkPermissions(updateRoleDto.permissions);

    return await this.roleModel.findByIdAndUpdate(code, updateRoleDto, {
      new: true,
    });
  }

  async deleteRole(code: number): Promise<string> {
    const role = await this.getRoleById(code);

    await role.deleteOne();

    return 'deleted successfully';
  }

  // change my password
  async changeMyPassword(
    changeMyPasswordDto: ChangeMyPasswordDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { new_password, old_password } = changeMyPasswordDto;

    const user: any = await this.userModel.findOne(this.request.user).select('password');

    const isCorrectPassword = await user.validatePassword(old_password);

    if (!isCorrectPassword)
      throw new BadRequestException('the entered password is invalid');

    user.password = new_password;
    await user.save();

    return {
      accessToken: this.generateAccessToken(user._id),
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  // change my information
  async changeMyInfo(changeMyInfoDto: ChangeMyInfoDto): Promise<string> {
    const data: any = changeMyInfoDto;

    const fieldsToExclude = [
      'isSuperAdmin',
      'isStaff',
      'roles',
      'password',
      'email',
      'phoneNumber',
      'isActive',
      'verified',
    ];

    const user = await this.userModel.findOne(this.request.user);

    fieldsToExclude.forEach((el) => delete data[el]);

    await user.updateOne(data);

    return 'your information changed successfully';
  }

  // verify email
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, token } = verifyEmailDto;

    const filter = {
      email,
      verified: false,
      isActive: true,
      verificationExpires: { $gt: new Date() },
    };

    const user: UserDocument = await this.findUser(
      filter,
      {},
      {
        sort: { createdAt: -1 },
      },
    );

    if (token !== user.verificationCode) {
      this.createAuthHistory(user._id, authActions.VERIFICATION_CODE_REJECTED);
      throw new BadRequestException('invalid token, please verify again');
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    this.createAuthHistory(user._id, authActions.VERIFICATION_CODE_CONFIRMED);
    const accessToken = this.generateAccessToken(user._id);
    return {
      accessToken,
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }
  // verify phone number
  async verifyPhoneNumber(
    verifyPhoneNumberDto: VerifyPhoneNumberDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { phoneNumber, token } = verifyPhoneNumberDto;
    const filter = {
      phoneNumber,
      verified: false,
      isActive: true,
      verificationExpires: { $gt: new Date() },
    };

    const user: UserDocument = await this.findUser(
      filter,
      {},
      {
        sort: { createdAt: -1 },
      },
    );

    if (token !== user.verificationCode) {
      this.createAuthHistory(user._id, authActions.VERIFICATION_CODE_REJECTED);
      throw new BadRequestException('invalid token, please verify again');
    }

    // set user as verified
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    this.createAuthHistory(user._id, authActions.VERIFICATION_CODE_CONFIRMED);

    const accessToken = this.generateAccessToken(user._id);
    return {
      accessToken,
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  // refresh access token
  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<{ accessToken: string }> {
    const user_id = await this.findRefreshToken(refreshAccessTokenDto.refreshToken);

    const user = await this.userModel.findById(user_id);
    if (!user) throw new UnauthorizedException();

    this.createAuthHistory(user._id, authActions.REFRESH_ACCESS_TOKEN);

    return { accessToken: this.generateAccessToken(user._id) };
  }

  // forgot password
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ forgotPasswordToken: number }> {
    let filter;
    const { email, phoneNumber } = forgotPasswordDto;
    if (!email && !phoneNumber)
      throw new BadRequestException('Please enter either phone number or email');

    if (email && phoneNumber)
      throw new BadRequestException('we want one of phone number or email');

    if (email) filter = { email, verified: true, isActive: true };
    else if (phoneNumber) filter = { phoneNumber, verified: true, isActive: true };

    const user = await this.findUser(filter);

    // create forgot password
    const forgotPassword = await this.createForgotPassword(user._id);

    this.createAuthHistory(user._id, authActions.FORGOT_PASSWORD);

    return { forgotPasswordToken: forgotPassword };
  }

  // verify forgot password
  async verifyForgotPassword(
    verifyForgotPassword: VerifyForgotPasswordDto,
  ): Promise<string> {
    const { email, phoneNumber } = verifyForgotPassword;
    let user: UserDocument;

    if (!email && !phoneNumber)
      throw new BadRequestException('Please enter either phone number or email');

    if (email) user = await this.findUser({ email, isActive: true, verified: true });

    if (phoneNumber)
      user = await this.findUser({ phoneNumber, isActive: true, verified: true });

    const forgotPassword = await this.forgotPasswordModel.findOne({
      forgotPasswordToken: verifyForgotPassword.token,
      user: user._id,
      used: false,
      forgotPasswordExpires: { $gt: new Date() },
    });

    if (!forgotPassword) throw new BadRequestException('the verify token is invalid');

    forgotPassword.used = true;
    await forgotPassword.save();

    return 'ok, now reset your password';
  }

  // reset password
  async resetPassword(
    passwordResetDto: PasswordResetDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, phoneNumber, password } = passwordResetDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('Please enter either phone number or email');

    const filter = { $or: [{ email }, { phoneNumber }], verified: true, isActive: true };

    const user = await this.findUser(filter);

    const forgotPassword = await this.forgotPasswordModel.findOne({
      user: user._id,
      used: true,
      forgotPasswordExpires: { $gt: new Date() },
    });

    if (!forgotPassword) throw new BadRequestException('please verify again');

    user.password = password;
    await user.save();

    this.createAuthHistory(user._id, authActions.RESET_PASSWORD);

    return {
      accessToken: this.generateAccessToken(user._id),
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  // ***************** private methods ********************

  private async checkRoleExistence(roleName: string) {
    const role = await this.roleModel.findOne({ name: roleName });
    if (role) throw new BadRequestException('This role name already exists');
  }

  private checkPermissions(permissions: Array<string>) {
    permissions.forEach((permission) => {
      if (!Object.values(mainPermissions).includes(permission))
        throw new BadRequestException('please enter valid permissions');
    });
  }

  private async findUser(filter, fields = {}, options = {}): Promise<UserDocument> {
    const user = await this.userModel.findOne(filter, fields, options);
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  // refresh token
  private async generateRefreshToken(user_id: UserDocument): Promise<string> {
    const refreshToken = await this.refreshTokenModel.create({
      user: user_id,
      refreshToken: uuidv4(),
      ip: getClientIp(this.request),
      agent: this.request.headers['user-agent'] || 'XX',
    });
    return refreshToken.refreshToken;
  }

  private async createForgotPassword(user_id: UserDocument): Promise<number> {
    const forgotPassword = await this.forgotPasswordModel.create({
      user: user_id,
      forgotPasswordToken: this.generateRandomNumber(6),
      forgotPasswordExpires: addMinutes(Date.now(), 30),
      ip: getClientIp(this.request),
      agent: this.request.headers['user-agent'] || 'XX',
      used: false,
    });

    return forgotPassword.forgotPasswordToken;
  }

  private async findRefreshToken(token: string): Promise<any> {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) throw new UnauthorizedException('user has been logged out.');

    return refreshToken.user;
  }

  private async setVerifyInfo(user: UserDocument): Promise<void> {
    user.verificationCode = this.generateRandomNumber(6);
    user.verificationExpires = addHours(Date.now(), global.VERIFICATION_EXPIRES);
    await user.save();
  }

  private generateAccessToken(userId: string): string {
    const payload: JwtPayload = {
      id: userId,
    };
    // generate access token
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async checkUserExistence(authSignUpDto: AuthSignUpDto): Promise<void> {
    const { email, phoneNumber } = authSignUpDto;
    let findByEmail: UserDocument;
    let findByPhone: UserDocument;

    if (!email && !phoneNumber)
      throw new BadRequestException('Please enter either phone number or email');

    if (email && phoneNumber)
      throw new BadRequestException('we want one of phone number or email');

    if (email)
      findByEmail = await this.userModel.findOne({
        email,
        isActive: true,
        verified: true,
      });
    if (phoneNumber)
      findByPhone = await this.userModel.findOne({
        phoneNumber,
        isActive: true,
        verified: true,
      });

    if (findByPhone || findByEmail)
      throw new BadRequestException('the user has already exists');
  }

  private async validateUserInput(authSignInDto: AuthSignInDto): Promise<any> {
    const { email, phoneNumber, password } = authSignInDto;
    let user;

    if (!email && !phoneNumber)
      throw new BadRequestException('Please enter either phone number or email');

    if (email && phoneNumber)
      throw new BadRequestException('we want one of phone number or email');

    if (email)
      user = await this.userModel
        .findOne({ email, isActive: true, verified: true })
        .select('+password');
    if (phoneNumber)
      user = await this.userModel
        .findOne({ phoneNumber, isActive: true, verified: true })
        .select('+password');

    if (!user) throw new UnauthorizedException();

    this.isUserBlocked(user);

    await this.checkPasswordAttempts(user, password);

    return user;
  }

  private isUserBlocked(user: UserDocument): void {
    if (user.blockExpires > new Date())
      throw new BadRequestException('the user has been blocked, please try later');
  }

  private async checkPasswordAttempts(user: any, password: string): Promise<void> {
    const isCorrectPassword = await user.validatePassword(password);

    if (!isCorrectPassword) {
      user.confirmationAttemptsCount += 1;
      await user.save();

      if (user.confirmationAttemptsCount >= global.LOGIN_ATTEMPTS_TO_BLOCK) {
        user.blockExpires = addHours(Date.now(), global.HOUR_TO_BLOCK);
        await user.save();
        throw new BadRequestException('user blocked. Please try again in 1 hour');
      }
      throw new UnauthorizedException();
    }

    user.confirmationAttemptsCount = 0;
    await user.save();
  }

  private async createAuthHistory(user_id: UserDocument, action: string): Promise<void> {
    await this.authHistoryModel.create({
      user: user_id,
      action,
      ip: getClientIp(this.request),
      agent: this.request.headers['user-agent'] || 'XX',
    });
  }

  private generateRandomNumber(length = 6): number {
    const token = Array(length)
      .fill(null)
      .map(() => Math.floor(Math.random() * 10).toString(10))
      .join('');
    return parseInt(token);
  }
}
