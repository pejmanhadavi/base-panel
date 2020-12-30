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
import { BasketsService } from './baskets.service';
import { BasketDocument } from './schemas/basket.schema';

@ApiBearerAuth()
@ApiTags('baskets')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}

  @Get()
  @Roles(permissions.READ_BASKET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all baskets' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<BasketDocument[]> {
    return await this.basketsService.getAll(filterQueryDto);
  }

  @Get(':id')
  @Roles(permissions.READ_BASKET)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a basket instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<BasketDocument> {
    return await this.basketsService.getById(code);
  }

  @Delete('/:id')
  @Roles(permissions.DELETE_BASKET)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete basket' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.basketsService.delete(code);
  }
}
