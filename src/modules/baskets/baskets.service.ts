import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Basket, BasketDocument } from './schemas/basket.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class BasketsService {
  constructor(
    @InjectModel(Basket.name) private readonly basketModel: Model<BasketDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.basketModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const basket = await filterQuery.query
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('coupon', 'name amount expiresAt code -_id')
      .populate('products', 'title price code -_id');

    return basket;
  }
  async getById(code: number) {
    const basket = await this.basketModel
      .findOne({ code })
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('coupon', 'name amount expiresAt code -_id')
      .populate('products', 'title price code -_id');

    if (!basket) throw new NotFoundException();
    return basket;
  }

  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.basketModel, code);
    return;
  }
}
