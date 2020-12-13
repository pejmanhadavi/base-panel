import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Role } from 'src/modules/auth/schemas/role.schema';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'user@gmail.com',
    description: 'the unique email for each user',
    uniqueItems: true,
    minLength: 5,
    maxLength: 256,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(256)
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    type: String,
    example: '09123456789',
    description: 'User phone number',
    minLength: 11,
    maxLength: 11,
  })
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  @IsOptional()
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  readonly phoneNumber?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: true,
    description: 'Defining being staff',
  })
  @IsOptional()
  @IsBoolean()
  readonly isStaff?: boolean;

  @ApiProperty({
    type: [String],
    description: 'Defining being staff',
  })
  @IsOptional()
  @IsArray()
  readonly roles?: Array<Role>;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  readonly verified?: boolean;
}
