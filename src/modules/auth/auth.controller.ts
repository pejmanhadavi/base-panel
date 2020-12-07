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

@ApiTags('auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'signUp new user' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authSingUpDto: AuthSignUpDto): Promise<string | object> {
    return await this.authService.signUp(authSingUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'signIn the user' })
  async signIn(@Body() authSignInDto: AuthSignInDto): Promise<any> {
    return this.authService.signIn(authSignInDto);
  }

  // roles CRUD routes
  @Get('roles')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse()
  async getAllRoles(): Promise<RoleDocument[]> {
    return await this.authService.getAllRoles();
  }

  @Get('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiOkResponse()
  async getRoleById(@Param('id') id: string): Promise<any> {
    return await this.authService.getRoleById(id);
  }

  @Post('roles')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create role' })
  async createRole(@Body() creteRoleDto: CreateRoleDto): Promise<string | RoleDocument> {
    return await this.authService.createRole(creteRoleDto);
  }

  @Patch('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  @ApiOkResponse()
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return await this.authService.updateRole(id, updateRoleDto);
  }

  @Delete('roles/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role' })
  @ApiNoContentResponse()
  async deleteRole(@Param('id') id: string): Promise<string> {
    return this.authService.deleteRole(id);
  }

  // verify email
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'verify the email' })
  async verifyEmail(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.authService.verifyEmail(req, verifyUuidDto);
  }

  // verify phone number
  @Post('verify-phone-number')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'verify the phone number' })
  async verifyPhoneNumber(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.authService.verifyPhoneNumber(req, verifyUuidDto);
  }

  // refresh access token
  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Refresh Access Token with refresh token' })
  async refreshAccessToken(@Body() refreshAccessToke: RefreshAccessTokenDto) {
    return await this.authService.refreshAccessToken(refreshAccessToke);
  }

  // forgot password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({})
  async forgotPassword(
    @Req() req: Request,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return await this.authService.forgotPassword(req, forgotPasswordDto);
  }

  // forgot password verify
  @Post('forgot-password-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify forget password code' })
  @ApiOkResponse({})
  async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.authService.forgotPasswordVerify(verifyUuidDto);
  }

  // reset password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password after verify reset password' })
  @ApiOkResponse({})
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return await this.authService.resetPassword(passwordResetDto);
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
