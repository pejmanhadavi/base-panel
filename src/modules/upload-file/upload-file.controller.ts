import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/common/decorators/api-file.decorator';
import { ApiMultiFile } from 'src/common/decorators/api-multi-file.decorator';
import uploadImage from 'src/configs/upload-image.config';
import uploadMultiImage from 'src/configs/upload-multi-image.config';
import { UploadFileService } from './upload-file.service';

@ApiTags('upload-file')
@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Get('models')
  async getModelNames() {
    return await this.uploadFileService.getModelNames();
  }

  @Post('thumbnail/:modelName/:code/:field')
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
    @Param()
    { modelName, code, field }: { modelName: string; code: number; field: string },
    @UploadedFile() file,
  ) {
    return await this.uploadFileService.uploadThumbnail(
      modelName,
      code,
      field,
      file.filePath,
    );
  }

  @Post('picture/:modelName/:code/:field')
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
    @Param()
    { modelName, code, field }: { modelName: string; code: number; field: string },
    @UploadedFile() file,
  ) {
    return await this.uploadFileService.uploadPicture(
      modelName,
      code,
      field,
      file.filePath,
    );
  }

  @Post('pictures/:modelName/:code/:field')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(uploadMultiImage('picture'))
  async uploadFile(
    @Param()
    { modelName, code, field }: { modelName: string; code: number; field: string },
    @UploadedFiles()
    files,
  ) {
    const filePaths = files.map((file) => file.path);
    return await this.uploadFileService.uploadMultiPictures(
      modelName,
      code,
      field,
      filePaths,
    );
  }
}
