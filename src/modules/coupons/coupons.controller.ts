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
import { CouponsService } from './coupons.service';
import { CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_COUPON)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<CouponDocument[]> {
    return await this.couponsService.getAll(filterQueryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_COUPON)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a coupon by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<CouponDocument> {
    return await this.couponsService.getById(code);
  }

  @Post()
  @Roles(permissions.CREATE_COUPON)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create coupon' })
  async create(@Body() createCouponDto: CreateCouponDto): Promise<CouponDocument> {
    return await this.couponsService.create(createCouponDto);
  }

  @Patch(':id')
  @Roles(permissions.UPDATE_COUPON)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update coupon' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async update(
    @Param('id') code: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<CouponDocument> {
    return await this.couponsService.update(code, updateCouponDto);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_COUPON)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete coupon' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.couponsService.delete(code);
  }
}
