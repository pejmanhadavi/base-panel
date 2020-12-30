import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filterQuery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.paymentModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const Payment = await filterQuery.query.populate(
      'user',
      'email phoneNumber fullName code -_id',
    );

    return Payment;
  }
  async getById(code: number) {
    const payment = await this.paymentModel
      .findOne({ code })
      .populate('user', 'email phoneNumber fullName code -_id');

    if (!payment) throw new NotFoundException();
    return payment;
  }

  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.paymentModel, code);
    return;
  }
}
