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

export class UpdateCommentDto {
  @ApiProperty({
    name: 'body',
    description: 'comment body',
    example: 'hello',
    required: false,
    type: String,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  body?: string;

  @ApiProperty({
    name: 'product',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  product?: string;

  @ApiProperty({
    name: 'published',
    required: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    name: 'stars',
    description: 'comment stars',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  stars?: number;

  @ApiProperty({
    name: 'quality',
    description: 'comment quality',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  quality?: number;

  @ApiProperty({
    name: 'value',
    description: 'comment value',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  value?: number;

  @ApiProperty({
    name: 'innovation',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  innovation?: number;

  @ApiProperty({
    name: 'facilities',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  facilities?: number;

  @ApiProperty({
    name: 'easeOfUse',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  easeOfUse?: number;

  @ApiProperty({
    name: 'design',
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  design?: number;
}
