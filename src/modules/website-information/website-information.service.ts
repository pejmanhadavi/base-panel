import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { UpdateWebsiteInformationDto } from './dto/update-website-information.dto';
import {
  WebsiteInformation,
  WebsiteInformationDocument,
} from './schemas/website-information.schema';

@Injectable()
export class WebsiteInformationService {
  constructor(
    @InjectModel(WebsiteInformation.name)
    private readonly websiteInfoModel: Model<WebsiteInformationDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getWebsiteInfo(): Promise<WebsiteInformationDocument> {
    return await this.websiteInfoModel
      .findOne({ code: 1 })
      .populate('homeCategories', 'name');
  }

  async updateWebsiteInfo(updateWebsiteInfoDto: UpdateWebsiteInformationDto) {
    const { homeCategories } = updateWebsiteInfoDto;

    const data: any = { ...updateWebsiteInfoDto };

    if (homeCategories) await this.checkCategoryExistence(homeCategories);

    return await this.websiteInfoModel.findOneAndUpdate({ code: 1 }, data, { new: true });
  }

  // private methods
  private async checkCategoryExistence(categories: Array<string>) {
    for (const cat of categories) {
      if (!mongoose.isValidObjectId(cat))
        throw new BadRequestException('the entered homeCategories are invalid');

      if (!(await this.categoryModel.exists({ _id: cat })))
        throw new BadRequestException('the entered homeCategories are invalid');
    }
  }
}
