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

export class UpdateCouponDto {
  @ApiProperty({
    name: 'name',
    description: 'coupon name',
    required: false,
    type: String,
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string;

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
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  products?: Array<string>;

  @ApiProperty({
    name: 'categories',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  categories?: Array<string>;
}
