import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { ArticlesService } from './articles.service';
import { ArticleDocument } from './schema/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_ARTICLE)
  @ApiOperation({ summary: 'Get all article' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<ArticleDocument[]> {
    return await this.articlesService.getAll(filterQueryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_ARTICLE)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a article by id' })
  @ApiParam({ name: 'id', required: true })
  async getById(@Param('id') code: number): Promise<ArticleDocument> {
    return await this.articlesService.getById(code);
  }

  @Post()
  @Roles(permissions.CREATE_ARTICLE)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create article' })
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleDocument> {
    return await this.articlesService.create(createArticleDto);
  }

  @Patch(':id')
  @Roles(permissions.UPDATE_ARTICLE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update article' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async update(
    @Param('id') code: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleDocument> {
    return await this.articlesService.update(code, updateArticleDto);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_ARTICLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.articlesService.delete(code);
  }
}
