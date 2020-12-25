import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class UploadFileService {
  constructor(@InjectConnection() private connection: Connection) {}

  async uploadThumbnail(modelName: string, code: number, thumbnail: string) {
    if (!this.connection.modelNames().includes(modelName))
      throw new BadRequestException('model_does_not_exist');

    if (!this.connection.models[modelName].schema.obj.hasOwnProperty('thumbnail'))
      throw new BadRequestException(`you can not set thumbnail for ${modelName}s`);

    await this.connection.models[modelName].updateOne({ code }, { thumbnail });
    return 'thumbnail updated';
  }

  async getModelNames() {
    return await this.connection.modelNames();
  }
}
