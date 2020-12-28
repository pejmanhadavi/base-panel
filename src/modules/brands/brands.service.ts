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
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as fs from 'fs';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.brandModel, filterQueryDto, { _id: 0 });

    filterQuery.filter().limitFields().paginate().sort();

    return await filterQuery.query;
  }
  async getById(code: number) {
    const brand = await this.brandModel.findOne({ code }).select({ _id: 0 });
    if (!brand) throw new NotFoundException('Brand not found');

    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    await this.checkBrandExistence(createBrandDto.name);

    return await this.adminLogService.create(
      this.request.user,
      this.brandModel,
      createBrandDto,
    );
  }
  async update(code: number, updateBrandDto: UpdateBrandDto) {
    await this.getById(code);

    if (updateBrandDto.name) await this.checkBrandExistence(updateBrandDto.name);

    return await this.adminLogService.update(
      this.request.user,
      this.brandModel,
      code,
      updateBrandDto,
    );
  }
  async delete(code: number) {
    const brand = await this.adminLogService.delete(
      this.request.user,
      this.brandModel,
      code,
    );
    fs.unlink(brand.thumbnail, (err) => {
      if (err) throw new InternalServerErrorException();
    });
    return;
  }

  // private methods
  private async checkBrandExistence(name: string) {
    const brand = await this.brandModel.findOne({ name });
    if (brand) throw new BadRequestException('the brand already exists');
  }
}
