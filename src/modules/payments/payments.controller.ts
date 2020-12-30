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
import { PaymentsService } from './payments.service';
import { PaymentDocument } from './schemas/payment.schema';

@ApiBearerAuth()
@ApiTags('payments')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly basketsService: PaymentsService) {}

  @Get()
  @Roles(permissions.READ_PAYMENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<PaymentDocument[]> {
    return await this.basketsService.getAll(filterQueryDto);
  }

  @Get(':id')
  @Roles(permissions.READ_PAYMENT)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a payment instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<PaymentDocument> {
    return await this.basketsService.getById(code);
  }

  @Delete('/:id')
  @Roles(permissions.DELETE_PAYMENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete payment' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.basketsService.delete(code);
  }
}
