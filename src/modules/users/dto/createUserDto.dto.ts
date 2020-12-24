import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
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
    type: String,
    example: '09123456789',
    description: 'User phone number',
    minLength: 11,
    maxLength: 11,
  })
  @IsOptional()
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  @MinLength(11)
  @MaxLength(11)
  readonly phoneNumber?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'password!',
    description: 'the password of user',
    minLength: 8,
    maxLength: 1024,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(1024)
  readonly password: string;

  @ApiProperty({
    type: Boolean,
    default: true,
    description: 'Defining being staff',
  })
  @IsOptional()
  @IsBoolean()
  readonly isStaff?: boolean;

  @ApiProperty({
    type: [String],
    description: 'user roles',
  })
  @IsArray()
  @IsOptional()
  readonly roles?: Array<string>;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly verified?: boolean = false;
}
