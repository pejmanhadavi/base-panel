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
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiBearerAuth()
@ApiTags('products')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse()
  async getAllProducts(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<ProductDocument[]> {
    return await this.productService.getAll(filterQueryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', required: true })
  async getUserById(@Param('id') code: number): Promise<ProductDocument> {
    return await this.productService.getById(code);
  }

  @Post()
  @Roles(permissions.CREATE_PRODUCT)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create product' })
  async createUser(@Body() createProductDto: CreateProductDto): Promise<ProductDocument> {
    return await this.productService.create(createProductDto);
  }

  @Patch(':id')
  @Roles(permissions.UPDATE_PRODUCT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async updateUser(
    @Param('id') code: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    return await this.productService.update(code, updateProductDto);
  }

  @Delete(':id')
  @Roles(permissions.DELETE_PRODUCT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async deleteUser(@Param('id') code: number): Promise<void> {
    return this.productService.delete(code);
  }
}
