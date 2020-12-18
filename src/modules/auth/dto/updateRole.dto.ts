import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import permissions from '../../../constants/permissions.constant';

export class UpdateRoleDto {
  @ApiProperty({
    type: String,
    example: 'role name',
    description: 'the unique name for each role',
    minLength: 3,
    maxLength: 256,
  })
  @IsOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: [String],
    enumName: 'permissions',
    enum: Object.values(permissions),
    description: 'array of permissions',
  })
  @IsOptional()
  @IsArray()
  permissions?: Array<string>;
}
