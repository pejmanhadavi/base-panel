import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    name: 'title',
    description: 'product title',
    example: 'galaxy S20',
    type: String,
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string;

  @ApiProperty({
    name: 'homeCategories',
    description: 'home categories',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  homeCategories?: Array<string>;

  @ApiProperty({
    name: 'brand',
    description: 'product brand',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  brand?: string;

  @ApiProperty({
    name: 'stars',
    description: 'product stars',
    default: 3,
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @MaxLength(256)
  @Min(0)
  @Max(5)
  stars?: number;

  @ApiProperty({
    name: 'forWholeCountry',
    description: 'for Whole Country',
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  forWholeCountry?: boolean;

  @ApiProperty({
    name: 'maxDeliveryDays',
    description: 'Maximum delivery days',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  maxDeliveryDays?: number;

  @ApiProperty({
    name: 'colors',
    description: 'Product colors',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  colors?: Array<string>;

  @ApiProperty({
    name: 'sizes',
    description: 'Product sizes',
    type: [String],
  })
  @IsOptional()
  @IsNumber()
  sizes?: Array<string>;

  @ApiProperty({
    name: 'remainingNumber',
    description: 'Number of products remaining',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  remainingNumber?: number;

  @ApiProperty({
    name: 'price',
    description: 'Product price',
    required: true,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    name: 'discount',
    description: 'Product discount',
    default: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    name: 'weight',
    description: 'Product weight',
    default: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;
}
