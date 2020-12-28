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
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import platformsConstant from 'src/constants/platforms.constant';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name) private readonly bannerModel: Model<BannerDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly adminLogService: AdminLogsService,
  ) {}

  async getAll(filterQueryDto: FilterQueryDto) {
    const filterQuery = new FilterQueries(this.bannerModel, filterQueryDto, { _id: 0 });

    filterQuery.filter().limitFields().paginate().sort();

    return await filterQuery.query;
  }
  async getById(code: number) {
    const banner = await this.bannerModel.findOne({ code }).select({ _id: 0 });
    if (!banner) throw new NotFoundException('Banner not found');

    return banner;
  }

  async create(createBannerDto: CreateBannerDto) {
    await this.checkBannerExistence(createBannerDto.name);

    this.checkPlatforms(createBannerDto.platforms);

    return await this.adminLogService.create(
      this.request.user,
      this.bannerModel,
      createBannerDto,
    );
  }
  async update(code: number, updateBannerDto: UpdateBannerDto) {
    await this.getById(code);

    const { name, platforms } = updateBannerDto;

    if (name) await this.checkBannerExistence(name);

    if (platforms) this.checkPlatforms(platforms);

    return await this.adminLogService.update(
      this.request.user,
      this.bannerModel,
      code,
      updateBannerDto,
    );
  }
  async delete(code: number) {
    await this.adminLogService.delete(this.request.user, this.bannerModel, code);
    return;
  }

  // private methods
  private async checkBannerExistence(name: string) {
    const banner = await this.bannerModel.findOne({ name });
    if (banner) throw new BadRequestException('the banner already exists');
  }

  private checkPlatforms(platforms: string[]) {
    platforms.forEach((el) => {
      if (!Object.values(platformsConstant).includes(el))
        throw new BadRequestException('the entered platforms are invalid');
    });
  }
}
