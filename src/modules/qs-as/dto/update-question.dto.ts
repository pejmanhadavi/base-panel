import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty({
    name: 'body',
    description: 'question body',
    type: String,
    maxLength: 1024,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  body?: string;

  @ApiProperty({
    name: 'product',
    example: '5fe13e59fd04eb23382fbe90',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  product?: string;

  @ApiProperty({
    name: 'published',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
