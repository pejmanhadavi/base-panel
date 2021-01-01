import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import platforms from '../../../constants/platforms.constant';

export class CreateBannerDto {
  @ApiProperty({
    name: 'name',
    description: 'banner name',
    type: String,
    maxLength: 256,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @ApiProperty({
    name: 'platform',
    description: 'banner platform',
    type: [String],
    enumName: 'platform',
    enum: Object.values(platforms),
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  platforms: Array<string>;

  @ApiProperty({
    name: 'link',
    description: 'banner link',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  link: string;
}
