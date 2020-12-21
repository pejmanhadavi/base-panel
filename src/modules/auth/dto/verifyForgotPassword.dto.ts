import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyForgotPasswordDto {
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
    required: true,
    example: '09123456789',
    description: 'User phone number',
    minLength: 11,
    maxLength: 11,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  @MinLength(11)
  @MaxLength(11)
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'the forgot password token',
    example: 123456,
    format: 'number',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly token: number;
}
