import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({
    name: 'body',
    description: 'answer body',
    type: String,
    maxLength: 1024,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  body?: string;

  @ApiProperty({
    name: 'question',
    example: '5fe13e59fd04eb23382fbe90',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  question?: string;

  @ApiProperty({
    name: 'published',
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
