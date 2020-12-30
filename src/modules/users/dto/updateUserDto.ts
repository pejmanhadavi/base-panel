import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    name: 'email',
    type: String,
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
    name: 'phoneNumber',
    type: String,
    example: '09123456789',
    description: 'User phone number',
    minLength: 11,
    maxLength: 11,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  @MinLength(11)
  @MaxLength(11)
  readonly phoneNumber?: string;

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

  @ApiProperty({
    name: 'password',
    type: String,
    required: false,
    example: 'password!',
    description: 'the password of user',
    minLength: 8,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(1024)
  readonly password?: string;

  @ApiProperty({ name: 'avatar', type: String })
  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @ApiProperty({ name: 'nationalCode', type: String, maxLength: 32 })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  readonly nationalCode?: string;

  @ApiProperty({
    name: 'addresses',
    type: [Object],
    example: [{ state: 'california', country: 'usa' }],
  })
  @IsArray()
  @IsOptional()
  readonly addresses?: Array<Object>;

  @ApiProperty({ name: 'wishLists', description: 'user wishLists', type: [String] })
  @IsArray()
  @IsOptional()
  readonly wishLists?: Array<string>;

  @ApiProperty({ name: 'credit', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  readonly credit?: number;

  @ApiProperty({
    name: 'isStaff',
    type: Boolean,
    default: true,
    description: 'Defining being staff',
  })
  @IsOptional()
  @IsBoolean()
  readonly isStaff?: boolean;

  @ApiProperty({
    name: 'roles',
    type: [String],
    description: 'user roles',
  })
  @IsArray()
  @IsOptional()
  readonly roles?: Array<string>;

  @ApiProperty({
    name: 'verified',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly verified?: boolean = false;
}
