import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
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
import { OrdersService } from './orders.service';
import { OrderDocument } from './schemas/order.schema';

@ApiBearerAuth()
@ApiTags('orders')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(permissions.READ_ORDER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<OrderDocument[]> {
    return await this.ordersService.getAll(filterQueryDto);
  }

  @Get(':id')
  @Roles(permissions.READ_ORDER)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a order instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<OrderDocument> {
    return await this.ordersService.getById(code);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_ORDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.ordersService.delete(code);
  }
}
