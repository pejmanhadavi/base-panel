import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { GenerateFakeDataService } from './generate-fake-data.service';
import { GenerateInitialDataService } from './generate-initial-data.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [GenerateFakeDataService, GenerateInitialDataService],
  exports: [GenerateFakeDataService, GenerateInitialDataService],
})
export class GenerateDataModule {}
