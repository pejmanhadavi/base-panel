import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangeMyInfoDto {
  @ApiProperty({
    name: 'fullName',
    type: String,
    example: 'reza baratvand',
    minLength: 5,
    maxLength: 256,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(256)
  readonly fullName?: string;

  @ApiProperty({ name: 'nationalCode', type: String, maxLength: 32 })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  readonly nationalCode?: string;

  @ApiProperty({
    name: 'addresses',
    example: [{ state: 'california', country: 'usa' }],
    type: [Object],
  })
  @IsArray()
  @IsOptional()
  readonly addresses?: Array<Object>;

  @ApiProperty({ name: 'credit', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  readonly credit?: number;
}
