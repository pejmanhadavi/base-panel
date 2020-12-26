import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import platforms from 'src/constants/platforms.constant';

export class UpdateBannerDto {
  @ApiProperty({
    name: 'name',
    description: 'banner name',
    type: String,
    maxLength: 256,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  name?: string;

  @ApiProperty({
    name: 'platform',
    description: 'banner platform',
    type: [String],
    enum: Object.values(platforms),
    required: false,
  })
  @IsOptional()
  @IsArray()
  platforms?: Array<string>;

  @ApiProperty({
    name: 'link',
    description: 'banner link',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;
}
