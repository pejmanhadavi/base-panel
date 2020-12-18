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
import { AuthHistory, AuthHistoryDocument } from './schemas/authHistory.schema';
import authActions from '../../constants/auth-actions.constant';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { VerifyPhoneNumberDto } from './dto/verifyPhoneNumber.dto';
import { ObjectIdDto } from '../../common/dto/objectId.dto';
import { addHours } from 'date-fns';
import { ChangeMyPasswordDto } from './dto/changeMyPassword.dto';
import { ChangeMyInfoDto } from './dto/changeMyInfo.dto';
import mainPermissions from '../../constants/permissions.constant';
import { el } from 'date-fns/locale';
import { VerifyForgotPasswordDto } from './dto/verifyForgotPassword.dto';

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
  ) {}

  async signUp(
    req: Request,
    authSignUpDto: AuthSignUpDto,
  ): Promise<{ verificationCode: number }> {
    const { password, email, phoneNumber } = authSignUpDto;

    await this.checkUserExistence(authSignUpDto);

    const newUser = new this.userModel({ phoneNumber, email, password });

    await newUser.save();

    await this.setVerifyInfo(newUser);

    this.createAuthHistory(req, newUser._id, authActions.SIGN_UP);

    return { verificationCode: newUser.verificationCode };
  }

  async signIn(
    req: Request,
    authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUserInput(authSignInDto);

    this.createAuthHistory(req, user._id, authActions.SIGN_IN);

    return { accessToken: this.generateAccessToken(user._id) };
  }

  // ROLES CRUD
  async getAllRoles(): Promise<Role[]> {
    const roles = await this.roleModel.find({});
    return roles;
  }

  async getRoleById(objectIdDto: ObjectIdDto): Promise<RoleDocument> {
    const role = await this.roleModel.findById(objectIdDto.id);

    if (!role) throw new NotFoundException('the role not found');

    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const { name, permissions } = createRoleDto;

    await this.checkRoleExistence(name);

    await this.checkPermissions(permissions);

    return await this.roleModel.create(createRoleDto);
  }

  async updateRole(
    objectIdDto: ObjectIdDto,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    await this.getRoleById(objectIdDto);

    if (updateRoleDto.name) await this.checkRoleExistence(updateRoleDto.name);

    if (updateRoleDto.permissions) await this.checkPermissions(updateRoleDto.permissions);

    return await this.roleModel.findByIdAndUpdate(objectIdDto.id, updateRoleDto, {
      new: true,
    });
  }

  async deleteRole(objectIdDto: ObjectIdDto): Promise<string> {
    const role = await this.getRoleById(objectIdDto);

    await role.deleteOne();

    return 'deleted successfully';
  }

  // change my password
  async changeMyPassword(
    req: Request,
    changeMyPasswordDto: ChangeMyPasswordDto,
  ): Promise<string> {
    const { new_password, old_password } = changeMyPasswordDto;

    const user: any = await this.userModel.findOne(req.user).select('password');

    const isCorrectPassword = await user.validatePassword(old_password);

    if (!isCorrectPassword)
      throw new BadRequestException('the entered password is invalid');

    user.password = new_password;
    await user.save();
    return 'password changed successfully';
  }

  // change my information
  async changeMyInfo(req: Request, changeMyInfoDto: ChangeMyInfoDto): Promise<string> {
    const { email, phoneNumber } = changeMyInfoDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter email or phoneNumber');

    const user = await this.userModel.findOne(req.user);

    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    return 'your information changed successfully';
  }

  // verify email
  async verifyEmail(
    req: Request,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, token } = verifyEmailDto;

    const filter = {
      email,
      verified: false,
      isActive: true,
      verificationExpires: { $gt: new Date() },
    };

    const user: UserDocument = await this.findUser(filter);

    if (token !== user.verificationCode) {
      this.createAuthHistory(req, user._id, authActions.VERIFICATION_CODE_REJECTED);
      throw new BadRequestException('invalid token, please verify again');
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    this.createAuthHistory(req, user._id, authActions.VERIFICATION_CODE_CONFIRMED);
    const accessToken = this.generateAccessToken(user._id);
    return {
      accessToken,
      refreshToken: await this.generateRefreshToken(req, user._id),
    };
  }
  // verify phone number
  async verifyPhoneNumber(
    req: Request,
    verifyPhoneNumberDto: VerifyPhoneNumberDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { phoneNumber, token } = verifyPhoneNumberDto;
    const filter = {
      phoneNumber,
      verified: false,
      isActive: true,
      verificationExpires: { $gt: new Date() },
    };

    const user: UserDocument = await this.findUser(filter);

    if (token !== user.verificationCode) {
      this.createAuthHistory(req, user._id, authActions.VERIFICATION_CODE_REJECTED);
      throw new BadRequestException('invalid token, please verify again');
    }

    // set user as verified
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();

    this.createAuthHistory(req, user._id, authActions.VERIFICATION_CODE_CONFIRMED);

    const accessToken = this.generateAccessToken(user._id);
    return {
      accessToken,
      refreshToken: await this.generateRefreshToken(req, user._id),
    };
  }

  // refresh access token
  async refreshAccessToken(
    req: Request,
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<{ accessToken: string }> {
    const user_id = await this.findRefreshToken(refreshAccessTokenDto.refreshToken);

    const user = await this.userModel.findById(user_id);
    if (!user) throw new UnauthorizedException();

    this.createAuthHistory(req, user._id, authActions.REFRESH_ACCESS_TOKEN);

    return { accessToken: this.generateAccessToken(user._id) };
  }

  // forgot password
  async forgotPassword(
    req: Request,
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ forgotPasswordToken: number }> {
    const { email, phoneNumber } = forgotPasswordDto;
    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

    if (email && phoneNumber)
      throw new BadRequestException('we want one of phone number or email');

    const filter = { $or: [{ email }, { phoneNumber }], verified: true, isActive: true };
    const user = await this.findUser(filter);

    // create forgot password
    const forgotPassword = await this.createForgotPassword(req, user._id);

    this.createAuthHistory(req, user._id, authActions.FORGOT_PASSWORD);

    return { forgotPasswordToken: forgotPassword };
  }

  // verify forgot password
  async forgotPasswordVerify(
    verifyForgotPassword: VerifyForgotPasswordDto,
  ): Promise<string> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      forgotPasswordToken: verifyForgotPassword.token,
      used: false,
      forgotPasswordExpires: { $gt: new Date() },
    });
    if (!forgotPassword) throw new BadRequestException('the verify token is invalid');

    forgotPassword.used = true;
    await forgotPassword.save();

    return 'ok, please reset your password';
  }

  // reset password
  async resetPassword(req: Request, passwordResetDto: PasswordResetDto): Promise<string> {
    const { email, phoneNumber, password } = passwordResetDto;

    if (!email && !phoneNumber)
      throw new BadRequestException('please enter phone number or email');

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

    this.createAuthHistory(req, user._id, authActions.RESET_PASSWORD);

    return 'Password changed successfully';
  }

  // ***************** private methods ********************

  private async checkRoleExistence(roleName: string) {
    const role = await this.roleModel.findOne({ name: roleName });
    if (role) throw new BadRequestException('This role name already exists');
  }

  private async checkPermissions(permissions: Array<string>) {
    const temp = [];
    const validPermissions = permissions.map((prm) => {
      for (const key in mainPermissions) {
        const element = mainPermissions[key];
        temp.push(element);
      }
      if (temp.includes(prm)) return true;
      return false;
    });

    if (validPermissions.includes(false))
      throw new BadRequestException('the permissions entered are invalid');
  }

  private async findUser(filter: any): Promise<UserDocument> {
    const user = await this.userModel.findOne(filter);
    if (!user) throw new BadRequestException('bad request');
    return user;
  }

  // refresh token
  private async generateRefreshToken(
    req: Request,
    user_id: UserDocument,
  ): Promise<string> {
    const refreshToken = await this.refreshTokenModel.create({
      user: user_id,
      refreshToken: uuidv4(),
      ip: getClientIp(req),
      agent: req.headers['user-agent'] || 'XX',
    });
    return refreshToken.refreshToken;
  }

  private async createForgotPassword(
    req: Request,
    user_id: UserDocument,
  ): Promise<number> {
    const forgotPassword = await this.forgotPasswordModel.create({
      user: user_id,
      forgotPasswordToken: Math.floor(Math.random() * 999999 + 1),
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

    return refreshToken.user;
  }

  private async setVerifyInfo(user: UserDocument): Promise<void> {
    user.verificationCode = Math.floor(Math.random() * 999999 + 1);
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
      throw new BadRequestException('please enter phone number or email');

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
      throw new BadRequestException('please enter phone number or email');

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

  private async createAuthHistory(
    req: Request,
    user_id: UserDocument,
    action: string,
  ): Promise<void> {
    await this.authHistoryModel.create({
      user: user_id,
      action,
      ip: getClientIp(req),
      agent: req.headers['user-agent'] || 'XX',
    });
  }
}
