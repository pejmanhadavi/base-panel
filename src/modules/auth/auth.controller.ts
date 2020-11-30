import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { AuthSignUpDto } from './dto/auth-signUp.dto';
import { RolesGuard } from './guards/roles.guard';
import permissions from '../../constants/permissions.contant';

@ApiTags('auth')
@UseGuards(AuthGuard('jwt'))
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'signUp new user' })
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
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(permissions.create_user)
  @ApiOperation({ summary: 'a protected route to create user' })
  async createUser() {
    return 'user created';
  }
}
