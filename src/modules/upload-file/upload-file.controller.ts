import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/common/decorators/api-file.decorator';
import uploadThumbnailConfig from 'src/configs/upload-thumbnail.config';
import { UploadFileService } from './upload-file.service';

@ApiTags('upload-file')
@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Get('models')
  async getModelNames() {
    return await this.uploadFileService.getModelNames();
  }

  @Post(':modelName/:code')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiParam({
    name: 'modelName',
    required: true,
    type: 'string',
    description: 'name of model',
    example: 'Product or Category',
  })
  @ApiParam({ name: 'code', required: true, type: 'number' })
  @UseInterceptors(uploadThumbnailConfig)
  async createArticle(
    @Param() { modelName, code }: { modelName: string; code: number },
    @UploadedFile() file,
  ) {
    return await this.uploadFileService.uploadThumbnail(modelName, code, file.filePath);
  }
}
