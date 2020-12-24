import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    name: 'name',
    description: 'category name',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1024)
  name?: string;

  // @ApiProperty({
  //   name: 'thumbnail',
  //   description: 'category thumbnail image',
  //   type: String,
  //   required: true,
  // })
  // @IsString()
  // @IsNotEmpty()
  // thumbnail: string;

  // @ApiProperty({
  //   name: 'picture',
  //   description: 'category picture',
  //   type: String,
  //   required: true,
  // })
  // @IsString()
  // @IsNotEmpty()
  // picture: string;

  @ApiProperty({
    name: 'parent',
    description: 'category parent id',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  parent?: string;

  @ApiProperty({
    name: 'properties',
    description: 'category properties',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  properties?: Array<string>;
}
