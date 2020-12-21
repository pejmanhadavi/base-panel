import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { RolesGuard } from './guards/roles.guard';
import { RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { VerifyUuidDto } from './dto/verifyUuid.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { VerifyPhoneNumberDto } from './dto/verifyPhoneNumber.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ObjectIdDto } from '../../common/dto/objectId.dto';
import { Role } from './schemas/role.schema';
import { ChangeMyPasswordDto } from './dto/changeMyPassword.dto';
import { ChangeMyInfoDto } from './dto/changeMyInfo.dto';
import { VerifyForgotPasswordDto } from './dto/verifyForgotPassword.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'signUp new user' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Req() req: Request,
    @Body() authSingUpDto: AuthSignUpDto,
  ): Promise<string | { verificationCode: number }> {
    return await this.authService.signUp(req, authSingUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'signIn the user' })
  async signIn(
    @Req() req: Request,
    @Body() authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(req, authSignInDto);
  }

  // roles CRUD routes
  @Get('roles')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse()
  async getAllRoles(): Promise<Role[]> {
    return await this.authService.getAllRoles();
  }

  @Get('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async getRoleById(@Param() objectIdDto: ObjectIdDto): Promise<RoleDocument> {
    return await this.authService.getRoleById(objectIdDto);
  }

  @Post('roles')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create role' })
  async createRole(@Body() creteRoleDto: CreateRoleDto): Promise<RoleDocument> {
    return await this.authService.createRole(creteRoleDto);
  }

  @Patch('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update role' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async updateRole(
    @Param() objectIdDto: ObjectIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return await this.authService.updateRole(objectIdDto, updateRoleDto);
  }

  @Delete('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({ name: 'id', required: true })
  async deleteRole(@Param() objectIdDto: ObjectIdDto): Promise<string> {
    return this.authService.deleteRole(objectIdDto);
  }

  // change my password
  @Post('change-my-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @ApiOperation({ summary: 'change my password' })
  async changeMyPassword(
    @Req() req: Request,
    @Body()
    changeMyPassword: ChangeMyPasswordDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.changeMyPassword(req, changeMyPassword);
  }

  // change my password
  @Post('change-my-info')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @ApiOperation({ summary: 'change my information' })
  async changeMyInfo(
    @Req() req: Request,
    @Body()
    changeMyInfo: ChangeMyInfoDto,
  ): Promise<string> {
    return await this.authService.changeMyInfo(req, changeMyInfo);
  }

  // verify email
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'verify the email' })
  async verifyEmail(
    @Req() req: Request,
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.verifyEmail(req, verifyEmailDto);
  }

  // verify phone number
  @Post('verify-phone-number')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'verify the phone number' })
  async verifyPhoneNumber(
    @Req() req: Request,
    @Body() verifyPhoneNumberDto: VerifyPhoneNumberDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.verifyPhoneNumber(req, verifyPhoneNumberDto);
  }

  // refresh access token
  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Refresh Access Token with refresh token' })
  async refreshAccessToken(
    @Req() req: Request,
    @Body() refreshAccessToke: RefreshAccessTokenDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(req, refreshAccessToke);
  }

  // forgot password
  @Post('forgot-password')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({})
  async forgotPassword(
    @Req() req: Request,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ forgotPasswordToken: number }> {
    return await this.authService.forgotPassword(req, forgotPasswordDto);
  }

  // verify forgot password
  @Post('verify-forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify forget password code' })
  @ApiOkResponse({})
  async verifyForgotPassword(
    @Req() req: Request,
    @Body() verifyForgotPassword: VerifyForgotPasswordDto,
  ): Promise<string> {
    return await this.authService.verifyForgotPassword(verifyForgotPassword);
  }

  // reset password
  @Post('reset-password')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reset password after verify reset password' })
  @ApiOkResponse({})
  async resetPassword(
    @Req() req: Request,
    @Body() passwordResetDto: PasswordResetDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.resetPassword(req, passwordResetDto);
  }
}

// verify-email
// verify-phone-number
// refresh-access-token
// forgot-password
// forgot-password-verify
// reset-password

// CRUD ROLE ++
// CRUD USER ++

// -------------------------
// userSchema =>auth:  objectId('auth')
//authHistory: objectId('authHistory')
// phoneNumber
// email
// isVerified
// verificationCode
// verification expires
// user => objectId('user')
// confirmationAttemptsCount
// blockExpires: Date !!!!

// -------------------------
// authHistorySchema =>
// user: objectId('user')
// action:
/*
      VERIFICATION_CODE_REQUEST
      VERIFICATION_CODE_CONFIRMED
      VERIFICATION_CODE_REJECTED
      SIGN_OUT
      SIGN_IN
      FORGOT_PASSWORD
      VERIFY_FORGOT_PASSWORD
  */
// date
// ip
// agent
// -------------------------
// forgot password schema =>
// user: objectId('user')
// forgot password token
// forgot password-uuid => mail
// forgot password expires
// ip
// agent
// ------------------------
// refresh token schema =>
// refresh token: uuid
// user: objectId ref: 'user'

/*
signup (username, (email or phonenumber))
db => optional
dto => optional
service => data.phoneNumber, data.email => Error
*/ // ++

/*
@IP ip
user agent https://www.npmjs.com/package/express-useragent
*/
