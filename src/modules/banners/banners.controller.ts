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
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { BannersService } from './banners.service';
import { BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiBearerAuth()
@ApiTags('banners')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @Roles(permissions.READ_BANNER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all banners' })
  @ApiOkResponse()
  async getAllProducts(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<BannerDocument[]> {
    return await this.bannersService.getAll(filterQueryDto);
  }

  @Get(':id')
  @Roles(permissions.READ_BANNER)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a banner by id' })
  @ApiParam({ name: 'id', required: true })
  async getUserById(@Param('id') code: number): Promise<BannerDocument> {
    console.log(code);

    return await this.bannersService.getById(code);
  }

  @Post()
  @Roles(permissions.CREATE_BANNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create banner' })
  async createUser(@Body() createBannerDto: CreateBannerDto): Promise<BannerDocument> {
    return await this.bannersService.create(createBannerDto);
  }

  @Patch(':id')
  @Roles(permissions.UPDATE_BANNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update banner' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async updateUser(
    @Param('id') code: number,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<BannerDocument> {
    return await this.bannersService.update(code, updateBannerDto);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_BANNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete banner' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async deleteUser(@Param('id') code: number): Promise<void> {
    return this.bannersService.delete(code);
  }
}
