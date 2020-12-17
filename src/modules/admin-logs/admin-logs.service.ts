import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLog, AdminLogDocument } from './schemas/adminLog.schema';
import adminLogs from 'src/constants/admin-logs.constant';

@Injectable()
export class AdminLogsService {
  constructor(@InjectModel(AdminLog.name) private adminLog: Model<AdminLogDocument>) {}

  async create(user: any, model, modelName: string, data: any): Promise<any> {
    const instance: any = await model.create(data);
    const adminLog: AdminLogDocument = new this.adminLog({
      user,
      model: model.modelName,
      code: instance.code,
      action: adminLogs.CREATE,
    });
    await adminLog.save();
    return instance;
  }

  async update(user: any, model: any, data: any, where: any): Promise<any> {
    const instance: any = await model.findOneAndUpdate(where, data);
    const adminLog: AdminLogDocument = new this.adminLog({
      user,
      model: model.modelName,
      code: instance.code,
      action: adminLogs.UPDATE,
    });
    await adminLog.save();
    return instance;
  }

  async delete(user: any, model: any, where) {
    const instance: any = await model.findOneAndDelete(where);
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
