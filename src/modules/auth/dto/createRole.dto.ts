import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import permissions from '../../../constants/permissions.constant';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    example: 'role name',
    description: 'the unique name for each role',
    minLength: 3,
    maxLength: 256,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  @IsString()
  name: string;

  @ApiProperty({
    type: [String],
    enumName: 'permissions',
    enum: Object.values(permissions),
    description: 'array of permissions',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  permissions: Array<string>;
}
