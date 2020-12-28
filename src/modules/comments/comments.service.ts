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
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.commentModel, filterQueryDto, { _id: 0 });

    filterQuery.filter().limitFields().paginate().sort();

    const comment = await filterQuery.query
      .populate('user', 'email phoneNumber -_id')
      .populate('product', 'title -_id');
    return comment;
  }
  async getById(code: number) {
    const comment = await this.commentModel
      .findOne({ code })
      .select({ _id: 0 })
      .populate('user', 'email phoneNumber -_id')
      .populate('product', 'title -_id');

    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(code: number, updateCommentDto: UpdateCommentDto) {
    await this.getById(code);

    if (updateCommentDto.product) await this.checkProduct(updateCommentDto.product);

    return await this.adminLogService.update(
      this.request.user,
      this.commentModel,
      code,
      updateCommentDto,
    );
  }
  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.commentModel, code);
    return;
  }

  // check category
  private async checkProduct(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new BadRequestException('the entered product not found');
  }
}
