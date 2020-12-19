import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sms, SmsSchema } from './schemas/sms.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Sms.name,
        useFactory: () => {
          const schema = SmsSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
