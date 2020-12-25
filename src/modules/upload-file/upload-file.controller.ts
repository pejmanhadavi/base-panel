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
import uploadImage from 'src/configs/upload-image.config';
import { UploadFileService } from './upload-file.service';

@ApiTags('upload-file')
@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Get('models')
  async getModelNames() {
    return await this.uploadFileService.getModelNames();
  }

  @Post('thumbnails/:modelName/:code')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiParam({
    name: 'modelName',
    required: true,
    type: 'string',
    description: 'name of model',
    example: 'Category',
  })
  @ApiParam({ name: 'code', required: true, type: 'number' })
  @UseInterceptors(uploadImage('thumbnail'))
  async uploadThumbnail(
    @Param() { modelName, code }: { modelName: string; code: number },
    @UploadedFile() file,
  ) {
    return await this.uploadFileService.uploadThumbnail(modelName, code, file.filePath);
  }

  @Post('pictures/:modelName/:code')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiParam({
    name: 'modelName',
    required: true,
    type: 'string',
    description: 'name of model',
    example: 'Category',
  })
  @ApiParam({ name: 'code', required: true, type: 'number' })
  @UseInterceptors(uploadImage('picture', 2 * 1000 * 1000))
  async uploadPicture(
    @Param() { modelName, code }: { modelName: string; code: number },
    @UploadedFile() file,
  ) {
    return await this.uploadFileService.uploadPicture(modelName, code, file.filePath);
  }
}
