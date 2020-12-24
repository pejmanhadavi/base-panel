import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WebsiteInformationService } from './website-information.service';
import { CreateWebsiteInformationDto } from './dto/create-website-information.dto';
import { UpdateWebsiteInformationDto } from './dto/update-website-information.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('website information')
@Controller('website-information')
export class WebsiteInformationController {
  constructor(private readonly websiteInformationService: WebsiteInformationService) {}

  @Post()
  create(@Body() createWebsiteInformationDto: CreateWebsiteInformationDto) {
    return this.websiteInformationService.create(createWebsiteInformationDto);
  }

  @Get()
  findAll() {
    return this.websiteInformationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteInformationService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateWebsiteInformationDto: UpdateWebsiteInformationDto,
  ) {
    return this.websiteInformationService.update(+id, updateWebsiteInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.websiteInformationService.remove(+id);
  }
}
