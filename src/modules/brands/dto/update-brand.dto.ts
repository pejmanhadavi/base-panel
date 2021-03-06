import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @ApiProperty({
    name: 'name',
    description: 'brand name',
    type: String,
    maxLength: 256,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  name?: string;

  @ApiProperty({
    name: 'thumbnail',
    description: 'brand thumbnail',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;
}
