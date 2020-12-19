import { Injectable } from '@nestjs/common';
import { CreateWebsiteInformationDto } from './dto/create-website-information.dto';
import { UpdateWebsiteInformationDto } from './dto/update-website-information.dto';

@Injectable()
export class WebsiteInformationService {
  create(createWebsiteInformationDto: CreateWebsiteInformationDto) {
    return 'This action adds a new websiteInformation';
  }

  findAll() {
    return `This action returns all websiteInformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websiteInformation`;
  }

  update(id: number, updateWebsiteInformationDto: UpdateWebsiteInformationDto) {
    return `This action updates a #${id} websiteInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} websiteInformation`;
  }
}
