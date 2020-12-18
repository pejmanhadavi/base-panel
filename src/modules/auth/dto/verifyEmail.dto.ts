import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

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
    example: 123456,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  token: number;
}
