import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class VerifyForgotPasswordDto {
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
