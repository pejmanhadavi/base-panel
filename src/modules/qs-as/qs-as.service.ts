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
import { Question, QuestionDocument } from './schemas/question.schema';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class QsAsService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name) private readonly answerModel: Model<AnswerDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  // *************** Question methods ***************

  async getAllQuestions(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.questionModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const question = await filterQuery.query
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('product', 'title code -_id');

    return question;
  }

  async updateQuestion(code: number, updateQuestionDto: UpdateQuestionDto) {
    await this.getQuestionById(code);

    if (updateQuestionDto.product) await this.checkProduct(updateQuestionDto.product);

    return await this.adminLogService.update(
      this.request.user,
      this.questionModel,
      code,
      updateQuestionDto,
    );
  }

  async getQuestionById(code: number) {
    const question = await this.questionModel
      .findOne({ code })
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('product', 'title code -_id');

    if (!question) throw new NotFoundException();
    return question;
  }

  async deleteQuestion(code: number) {
    await this.adminLogService.delete(this.request.user, this.questionModel, code);
    return;
  }
  // *************** Answer methods ***************

  async getAllAnswers(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.answerModel, filterQueryDto);

    filterQuery.filter().limitFields().paginate().sort();

    const answer = await filterQuery.query
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('question', 'body published code -_id');

    return answer;
  }

  async createAnswer(createAnswerDto: CreateAnswerDto) {
    const user: any = this.request.user;
    const data = { user: user._id, ...createAnswerDto };

    await this.checkQuestion(createAnswerDto.question);

    return await this.adminLogService.create(this.request.user, this.answerModel, data);
  }

  async updateAnswer(code: number, updateAnswerDto: UpdateAnswerDto) {
    await this.getAnswerById(code);

    if (updateAnswerDto.question) await this.checkQuestion(updateAnswerDto.question);

    return await this.adminLogService.update(
      this.request.user,
      this.answerModel,
      code,
      updateAnswerDto,
    );
  }

  async getAnswerById(code: number) {
    const answer = await this.answerModel
      .findOne({ code })
      .populate('user', 'email phoneNumber fullName code -_id')
      .populate('question', 'body published code -_id');

    if (!answer) throw new NotFoundException();
    return answer;
  }

  async deleteAnswer(code: number) {
    await this.adminLogService.delete(this.request.user, this.answerModel, code);
    return;
  }

  // private methods
  private async checkQuestion(questionId: string) {
    const question = await this.questionModel.findById(questionId);
    if (!question) throw new BadRequestException('the entered question is invalid');
  }

  private async checkProduct(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new BadRequestException('the entered product is invalid');
  }
}
