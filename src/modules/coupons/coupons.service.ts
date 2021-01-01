import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { FilterQueries } from '../../utils/filterQueries.util';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.couponModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    return await filterQuery.query
      .populate('categories', 'name')
      .populate('products', 'title');
  }
  async getById(code: number) {
    const coupon = await this.couponModel
      .findOne({ code })
      .populate('categories', 'name')
      .populate('products', 'title');

    if (!coupon) throw new NotFoundException('Coupon not found');

    return coupon;
  }

  async create(createCouponDto: CreateCouponDto) {
    const { name, categories, products } = createCouponDto;

    await this.checkCouponExistence(name);

    await this.doesInstanceModelExists(categories, this.categoryModel);
    await this.doesInstanceModelExists(products, this.productModel);

    return await this.adminLogService.create(
      this.request.user,
      this.couponModel,
      createCouponDto,
    );
  }

  async update(code: number, updateCouponDto: UpdateCouponDto) {
    await this.getById(code);

    const { name, categories, products } = updateCouponDto;

    if (name) await this.checkCouponExistence(name);

    if (categories) await this.doesInstanceModelExists(categories, this.categoryModel);

    if (products) await this.doesInstanceModelExists(products, this.productModel);

    return await this.adminLogService.update(
      this.request.user,
      this.couponModel,
      code,
      updateCouponDto,
    );
  }
  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.couponModel, code);
    return;
  }

  // private methods
  private async checkCouponExistence(name: string) {
    const coupon = await this.couponModel.findOne({ name });
    if (coupon)
      throw new BadRequestException('the coupon with the given name already exists ');
  }

  private async doesInstanceModelExists(instances: Array<string>, model) {
    for (const id of instances) {
      if (!mongoose.isValidObjectId(id))
        throw new BadRequestException(
          `the entered ${model.modelName.toLowerCase()}s id are invalid`,
        );

      if (!(await model.exists({ _id: id })))
        throw new BadRequestException(
          `the entered ${model.modelName.toLowerCase()}s id are invalid`,
        );
    }
  }
}
