import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyPhoneNumberDto {
  @ApiProperty({
    name: 'phoneNumber',
    description: 'user phoneNumber',
    required: true,
    example: '09123456789',
    type: String,
  })
  @IsPhoneNumber('IR', { message: 'the phoneNumber is wrong' })
  @IsNotEmpty()
  phoneNumber: string;

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
