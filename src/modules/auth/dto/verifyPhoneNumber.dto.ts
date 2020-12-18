import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

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
    example: 123456,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  token: number;
}
