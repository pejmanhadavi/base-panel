import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { products_projection } from './products.projection';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(
      this.productModel,
      filterQueryDto,
      products_projection,
    );

    filterQuery.filter().limitFields().paginate().sort();

    const product = await filterQuery.query.populate('category', 'name');
    return product;
  }
  async getById(code: number) {
    const product = this.productModel.findOne({ code });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    await this.checkProductExistence(createProductDto.title);

    await this.checkCategory(createProductDto.category);

    return await this.adminLogService.create(
      this.request.user,
      this.productModel,
      createProductDto,
    );
  }
  async update(code: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.title) await this.checkProductExistence(updateProductDto.title);

    return await this.adminLogService.update(
      this.request,
      this.productModel,
      code,
      updateProductDto,
    );
  }
  async delete(code: number) {
    const product = await this.adminLogService.delete(
      this.request,
      this.productModel,
      code,
    );
    fs.unlink(product.thumbnail, (err) => {
      if (err) throw new InternalServerErrorException();
    });
    return;
  }

  // private methods
  private async checkProductExistence(title: string) {
    const product = await this.productModel.findOne({ title });
    if (product) throw new BadRequestException('the product already exists');
  }

  // check category
  private async checkCategory(categoryId: string) {
    const category = await this.categoryModel.findById(categoryId);
    if (!category) throw new BadRequestException('the entered category is invalid');
  }
}
