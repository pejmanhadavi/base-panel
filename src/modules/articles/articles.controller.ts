import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import uploadThumbnailConfig from 'src/configs/upload-thumbnail.config';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiFile } from 'src/common/decorators/api-file.decorator';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile('thumbnail')
  @UseInterceptors(uploadThumbnailConfig)
  async createArticle(@UploadedFile() file) {
    console.log(file.path); // save it in db
    return;
  }
}
