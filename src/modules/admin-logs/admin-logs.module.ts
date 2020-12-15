import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminLogsService } from './admin-logs.service';
import { AdminLog, AdminLogSchema } from './schemas/adminLog.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: AdminLog.name,
        useFactory: () => {
          const schema = AdminLogSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [AdminLogsService],
})
export class AdminLogsModule {}
