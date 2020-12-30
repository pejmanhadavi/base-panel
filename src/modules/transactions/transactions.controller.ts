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
import { TransactionsService } from './transactions.service';
import { TransactionDocument } from './schemas/transaction.schema';

@ApiBearerAuth()
@ApiTags('transactions')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @Roles(permissions.READ_TRANSACTION)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<TransactionDocument[]> {
    return await this.transactionsService.getAll(filterQueryDto);
  }

  @Get(':id')
  @Roles(permissions.READ_TRANSACTION)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a transaction instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<TransactionDocument> {
    return await this.transactionsService.getById(code);
  }

  @Delete('/:id')
  @Roles(permissions.DELETE_TRANSACTION)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.transactionsService.delete(code);
  }
}
