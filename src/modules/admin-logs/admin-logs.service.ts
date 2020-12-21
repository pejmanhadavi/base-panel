import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLog, AdminLogDocument } from './schemas/adminLog.schema';
import adminLogs from '../../constants/admin-logs.constant';
import { ObjectIdDto } from '../../../src/common/dto/objectId.dto';

@Injectable()
export class AdminLogsService {
  constructor(@InjectModel(AdminLog.name) private adminLog: Model<AdminLogDocument>) {}

  async create(user: any, model, data: any): Promise<any> {
    const instance: any = await model.create(data);
    if (!instance) throw new NotFoundException();
    const adminLog: AdminLogDocument = new this.adminLog({
      user,
      model: model.modelName,
      code: instance.code,
      action: adminLogs.CREATE,
    });
    await adminLog.save();
    return instance;
  }

  async update(user: any, model: any, id: string, data: any): Promise<any> {
    const instance: any = await model.findByIdAndUpdate(id, data, { new: true });
    if (!instance) throw new NotFoundException();
    const adminLog: AdminLogDocument = new this.adminLog({
      user,
      model: model.modelName,
      code: instance.code,
      action: adminLogs.UPDATE,
    });
    await adminLog.save();
    return instance;
  }

  async delete(user: any, model: any, id: string) {
    const instance: any = await model.findByIdAndDelete(id);
    if (!instance) throw new NotFoundException();
    const adminLog: AdminLogDocument = new this.adminLog({
      user,
      model: model.modelName,
      code: instance.code,
      action: adminLogs.DELETE,
    });
    await adminLog.save();
    return instance;
  }
}
