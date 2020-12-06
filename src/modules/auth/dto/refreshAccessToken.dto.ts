import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshAccessTokenDto {
  @ApiProperty({
    description: 'uuid for refresh token',
    format: 'uuid',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly refreshToken: string;
}
