import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWebsiteInformationDto {
  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'logo',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    name: 'homeSliderImages',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  homeSliderImages?: Array<string>;

  @ApiProperty({
    name: 'homeEndImages',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  homeEndImages?: Array<string>;

  @ApiProperty({
    name: 'blogPicture',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  blogPicture?: string;

  @ApiProperty({
    name: 'homeCategories',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  homeCategories?: Array<string>;

  @ApiProperty({
    name: 'instagramLink',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  instagramLink?: string;

  @ApiProperty({
    name: 'twitterLink',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  twitterLink?: string;

  @ApiProperty({
    name: 'linkedinLink',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  linkedinLink?: string;

  @ApiProperty({
    name: 'newest',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  newest?: boolean;

  @ApiProperty({
    name: 'mostDiscounts',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  mostDiscounts?: boolean;

  @ApiProperty({
    name: 'mostSales',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  mostSales?: boolean;

  @ApiProperty({
    name: 'specialOffers',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  specialOffers?: boolean;

  @ApiProperty({
    name: 'mostVisited',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  mostVisited?: boolean;

  @ApiProperty({
    name: 'newsLetterEmails',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  newsLetterEmails?: Array<string>;

  @ApiProperty({
    name: 'Advantages',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  Advantages?: Array<string>;
}
