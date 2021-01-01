import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { FilterQueries } from '../../utils/filterQueries.util';
import { AdminLogsService } from '../admin-logs/admin-logs.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transAction: Model<TransactionDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.transAction, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const transaction = await filterQuery.query
      .populate('order', 'user status code -_id')
      .populate('payment', '-user -_id')
      .populate('transaction', ' -_id');

    return transaction;
  }
  async getById(code: number) {
    const transaction = await this.transAction
      .findOne({ code })
      .populate('order', 'user status code -_id')
      .populate('payment', '-user -_id')
      .populate('transaction', ' -_id');

    if (!transaction) throw new NotFoundException();
    return transaction;
  }

  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.transAction, code);
    return;
  }
}
