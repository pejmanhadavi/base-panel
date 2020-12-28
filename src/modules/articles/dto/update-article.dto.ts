import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    name: 'title',
    description: 'article title',
    required: false,
    type: String,
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string;

  @ApiProperty({
    name: 'description',
    description: 'article description',
    required: false,
    type: String,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  @ApiProperty({
    name: 'body',
    description: 'article body',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    name: 'thumbnail',
    description: 'article thumbnail',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    name: 'visits',
    description: 'article visits',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  visits?: number;

  @ApiProperty({
    name: 'published',
    description: 'article published',
    required: false,
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
