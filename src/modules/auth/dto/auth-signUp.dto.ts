import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @ApiProperty({
    type: String,
    example: 'myUsername',
    description: 'the unique username for each user',
    minLength: 3,
    maxLength: 256,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'myPassword',
    description: 'the password of user',
    minLength: 8,
    maxLength: 1024,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(1024)
  password: string;
}
