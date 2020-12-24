import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterQueryDto {
  @ApiProperty({ name: 'page', description: 'number of pages', required: false })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiProperty({
    name: 'limit',
    description: 'number of items per response, default: 20',
    required: false,
  })
  @IsString()
  @IsOptional()
  limit?: string;

  @ApiProperty({
    name: 'filter',
    description: 'filter the result by mongoose filters',
    required: false,
  })
  @IsString()
  @IsOptional()
  filter?: string;

  @ApiProperty({
    name: 'sort',
    description: 'sort the result by one or more property',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({
    name: 'fields',
    description: 'fields that return in the result',
    required: false,
  })
  @IsString()
  @IsOptional()
  fields?: string;
}
