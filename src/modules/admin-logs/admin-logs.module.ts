import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminLogsService } from './admin-logs.service';
import { AdminLog, AdminLogSchema } from './schemas/adminLog.schema';
import { AdminLogsController } from './admin-logs.controller';

@Global()
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
  exports: [AdminLogsService],
  controllers: [AdminLogsController],
})
export class AdminLogsModule {}
