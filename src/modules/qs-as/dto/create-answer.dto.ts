import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    name: 'body',
    description: 'answer body',
    type: String,
    maxLength: 1024,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  body?: string;

  @ApiProperty({
    name: 'question',
    example: '5fe13e59fd04eb23382fbe90',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  question: string;

  @ApiProperty({
    name: 'published',
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
