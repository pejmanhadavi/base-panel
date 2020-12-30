import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.orderModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const basket = await filterQuery.query
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('products', 'title price code -_id')
      .populate('payment', '-user -_id');

    return basket;
  }
  async getById(code: number) {
    const payment = await this.orderModel
      .findOne({ code })
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('products', 'title price code -_id')
      .populate('payment', '-user -_id');

    if (!payment) throw new NotFoundException();
    return payment;
  }

  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.orderModel, code);
    return;
  }
}
