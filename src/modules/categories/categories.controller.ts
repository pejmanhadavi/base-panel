import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDocument } from './schemas/category.schema';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_CATEGORY)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse()
  async getAll(@Query() filterQueryDto: FilterQueryDto): Promise<CategoryDocument[]> {
    return await this.categoriesService.getAll(filterQueryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_CATEGORY)
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiOkResponse()
  async getById(@Param('id') code: number): Promise<CategoryDocument> {
    return await this.categoriesService.getById(code);
  }

  @Post()
  @Roles(permissions.CREATE_CATEGORY)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create category' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @Roles(permissions.UPDATE_CATEGORY)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Update category' })
  async update(
    @Param('id') code: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    return await this.categoriesService.update(code, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_CATEGORY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete category' })
  async delete(@Param('id') code: number): Promise<void> {
    return await this.categoriesService.delete(code);
  }
}
