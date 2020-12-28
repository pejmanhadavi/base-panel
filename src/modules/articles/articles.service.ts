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
import { Article, ArticleDocument } from './schema/article.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.articleModel, filterQueryDto, {
      _id: 0 as any,
    });

    filterQuery.filter().limitFields().paginate().sort();

    return await filterQuery.query.populate('author', 'email phoneNumber -_id');
  }
  async getById(code: number) {
    const article = await this.articleModel
      .findOne({ code })
      .select({ _id: 0 })
      .populate('author', 'email phoneNumber -_id');

    if (!article) throw new NotFoundException('Article not found');

    return article;
  }

  async create(createArticleDto: CreateArticleDto) {
    const user: any = this.request.user;
    const data = { author: user._id, ...createArticleDto };

    await this.checkArticleExistence(createArticleDto.title);

    return await this.adminLogService.create(this.request.user, this.articleModel, data);
  }
  async update(code: number, updateArticleDto: UpdateArticleDto) {
    await this.getById(code);

    const { title } = updateArticleDto;

    if (title) await this.checkArticleExistence(title);

    return await this.adminLogService.update(
      this.request.user,
      this.articleModel,
      code,
      updateArticleDto,
    );
  }
  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.articleModel, code);
    return;
  }

  // private methods
  private async checkArticleExistence(title: string) {
    const article = await this.articleModel.findOne({ title });
    if (article)
      throw new BadRequestException('the article with the given title already exists ');
  }
}
