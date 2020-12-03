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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { RolesGuard } from './guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'signUp new user' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authSingUpDto: AuthSignUpDto): Promise<string | void> {
    return await this.authService.signUp(authSingUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'signIn the user' })
  async signIn(@Body() authSignInDto: AuthSignInDto): Promise<object | void> {
    return this.authService.signIn(authSignInDto);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'a private route' })
  async me() {
    return 'me';
  }

  @Get('/create-user')
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'a protected route to create user' })
  async createUser() {
    return 'user created';
  }

  // ROLES CRUD
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse()
  async getAllRoles(): Promise<RoleDocument[]> {
    return await this.authService.getAllRoles();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create role' })
  async createRole(
    @Body() creteRoleDto: CreateRoleDto,
  ): Promise<string | RoleDocument> {
    return await this.authService.createRole(creteRoleDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  @ApiOkResponse()
  async updateUser(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return await this.authService.updateRole(id, updateRoleDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role' })
  @ApiNoContentResponse()
  async deleteUser(@Param('id') id: string): Promise<string> {
    return this.authService.deleteRole(id);
  }
}

// verify-email
// verify-phone-number
// refresh-access-token
// forgot-password
// forgot-password-verify
// reset-password

// CRUD ROLE
// CRUD USER

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
// blockExpires: Date

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
*/

/*
@IP ip
user agent https://www.npmjs.com/package/express-useragent
*/
