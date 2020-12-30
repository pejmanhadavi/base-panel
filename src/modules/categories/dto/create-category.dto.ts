import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    name: 'name',
    description: 'category name',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  name: string;

  @ApiProperty({
    name: 'thumbnail',
    description: 'category thumbnail image',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    name: 'picture',
    description: 'category picture',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({
    name: 'parent',
    description: 'category parent id',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  parent: string;

  @ApiProperty({
    name: 'properties',
    description: 'category properties',
    type: [String],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  properties: Array<string>;
}
