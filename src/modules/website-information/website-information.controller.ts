import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { WebsiteInformationService } from './website-information.service';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WebsiteInformationDocument } from './schemas/website-information.schema';
import { UpdateWebsiteInformationDto } from './dto/update-website-information.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@ApiTags('website-information')
@Controller('website-information')
export class WebsiteInformationController {
  constructor(private readonly websiteInformationService: WebsiteInformationService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get website information' })
  @ApiOkResponse()
  async getWebsiteInfo(): Promise<WebsiteInformationDocument> {
    return await this.websiteInformationService.getWebsiteInfo();
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'edit website information' })
  @ApiCreatedResponse()
  async updateWebsiteInfo(
    @Body() updateWebsiteInfo: UpdateWebsiteInformationDto,
  ): Promise<WebsiteInformationDocument> {
    return await this.websiteInformationService.updateWebsiteInfo(updateWebsiteInfo);
  }
}
