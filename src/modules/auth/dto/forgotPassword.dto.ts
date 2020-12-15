import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'The email of the User',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'The phone number of the User',
    uniqueItems: true,
    minLength: 5,
    maxLength: 256,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  readonly phoneNumber?: string;
}
