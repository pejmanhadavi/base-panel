import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { category_projection } from './category.projection';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import * as fs from 'fs';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto): Promise<CategoryDocument[]> {
    const filterQuery = new FilterQueries(
      this.categoryModel,
      filterQueryDto,
      category_projection,
    );

    filterQuery.filter().limitFields().paginate().sort();
    const category = await filterQuery.query.populate('parent', 'name');
    return category;
  }

  async getById(code: number): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({ code })
      .populate('parent', 'name');
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parent } = createCategoryDto;

    await this.checkCategoryExistence(name);

    if (parent) await this.checkParent(parent);

    return await this.adminLogService.create(
      this.request.user,
      this.categoryModel,
      createCategoryDto,
    );
  }

  async update(
    code: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    const { name, parent } = updateCategoryDto;

    await this.checkCategoryExistence(name);

    if (parent) await this.checkParent(parent);

    return await this.adminLogService.update(
      this.request.user,
      this.categoryModel,
      code,
      updateCategoryDto,
    );
  }

  async delete(code: number): Promise<any> {
    const category = await this.adminLogService.delete(
      this.request.user,
      this.categoryModel,
      code,
    );

    fs.unlink(category.thumbnail, (err) => {
      if (err) throw new InternalServerErrorException();
    });

    fs.unlink(category.picture, (err) => {
      if (err) throw new InternalServerErrorException();
    });
  }

  private async checkCategoryExistence(name: string) {
    const category = await this.categoryModel.findOne({ name });
    if (category) throw new BadRequestException('this category already exists');
  }

  private async checkParent(id: string) {
    const parent = await this.categoryModel.findById(id);
    if (!parent)
      throw new BadRequestException('There is no category with the given parent id');
  }
}
