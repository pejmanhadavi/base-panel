import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class UploadFileService {
  constructor(@InjectConnection() private connection: Connection) {}

  async getModelNames() {
    return await this.connection.modelNames();
  }

  async uploadThumbnail(
    modelName: string,
    code: number,
    field: string,
    filePath: string,
  ) {
    await this.checkModelAndField(modelName, field);

    const instance = await this.connection.models[modelName].findOne({ code });
    instance[field] = filePath;
    return { instance, filePath };
  }

  async uploadPicture(modelName: string, code: number, field: string, filePath: string) {
    await this.checkModelAndField(modelName, field);

    const instance = await this.connection.models[modelName].findOne({ code });
    instance[field] = filePath;
    return { instance, filePath };
  }

  async uploadMultiPictures(
    modelName: string,
    code: number,
    field: string,
    filePaths: Array<string>,
  ) {
    await this.checkModelAndField(modelName, field);

    const instance = await this.connection.models[modelName].findOne({ code });
    instance[field] = filePaths;
    await instance.save();

    return { instance, filePaths };
  }

  private checkModelAndField(modelName, field) {
    if (!this.connection.modelNames().includes(modelName))
      throw new BadRequestException('model_does_not_exist');

    if (!this.connection.models[modelName].schema.obj.hasOwnProperty(field))
      throw new BadRequestException(`you can not set ${field} for ${modelName}s`);
  }
}
