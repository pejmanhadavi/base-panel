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

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { RolesGuard } from '../auth/guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
@ApiBearerAuth()
@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(permissions.READ_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse()
  async getAllUsers(): Promise<UserDocument[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/:id')
  @Roles(permissions.READ_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a user by id' })
  async getUserById(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.getUserById(id);
  }

  @Post()
  @Roles(permissions.CREATE_USER)
  @HttpCode(201)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  @Roles(permissions.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(permissions.DELETE_USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse()
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
