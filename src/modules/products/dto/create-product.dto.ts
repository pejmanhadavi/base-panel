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

export class CreateProductDto {
  @ApiProperty({
    name: 'title',
    description: 'product title',
    example: 'galaxy S20',
    required: true,
    type: String,
    maxLength: 256,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  title: string;

  @ApiProperty({
    name: 'category',
    description: 'product category',
    example: '5fe13e59fd04eb23382fbe90',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @ApiProperty({
    name: 'thumbnail',
    description: 'product thumbnail',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    name: 'pictures',
    description: 'product pictures',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  pictures?: Array<string>;

  @ApiProperty({
    name: 'brand',
    description: 'product brand',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  brand: string;

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
    name: '  review',
    description: 'Product review',
    type: String,
  })
  @IsOptional()
  @IsString()
  review?: string;

  @ApiProperty({
    name: 'sizes',
    description: 'Product sizes',
    type: [String],
  })
  @IsOptional()
  @IsArray()
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
  @IsNotEmpty()
  @IsNumber()
  price: number;

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
