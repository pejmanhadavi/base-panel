import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    name: 'email',
    description: 'user email',
    required: true,
    example: 'user@gmail.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'token',
    description: 'verification token',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
