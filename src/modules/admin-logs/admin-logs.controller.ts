import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminLogsService } from './admin-logs.service';
import { AdminLogDocument } from './schemas/adminLog.schema';

@ApiBearerAuth()
@ApiTags('adminLog')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('admin-logs')
export class AdminLogsController {
  constructor(private readonly adminLogService: AdminLogsService) {}
  @Get()
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all admin logs' })
  @ApiOkResponse()
  async getAllUsers(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<AdminLogDocument[]> {
    return await this.adminLogService.getAll(filterQueryDto);
  }
}
