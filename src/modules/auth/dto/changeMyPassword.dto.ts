import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeMyPasswordDto {
  @ApiProperty({
    name: 'old_password',
    description: 'the old password',
    example: 'oldPassword!',
    format: 'string',
    minLength: 8,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  old_password: string;

  @ApiProperty({
    name: 'new_password',
    description: 'the new password',
    example: 'newPassword!',
    format: 'string',
    minLength: 8,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  new_password: string;
}
