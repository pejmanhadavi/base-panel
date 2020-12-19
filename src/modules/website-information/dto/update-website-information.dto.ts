import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteInformationDto } from './create-website-information.dto';

export class UpdateWebsiteInformationDto extends PartialType(CreateWebsiteInformationDto) {}
