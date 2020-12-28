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

export class CreateCouponDto {
  @ApiProperty({
    name: 'name',
    description: 'coupon name',
    required: true,
    type: String,
    maxLength: 256,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  name: string;

  @ApiProperty({
    name: 'amount',
    description: 'coupon amount',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    name: 'usedCount',
    description: 'coupon usedCount',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  usedCount?: number;

  @ApiProperty({
    name: 'products',
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  products: Array<string>;

  @ApiProperty({
    name: 'categories',
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  categories: Array<string>;
}
