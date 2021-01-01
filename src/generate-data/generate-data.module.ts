import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../modules/categories/schemas/category.schema';
import {
  WebsiteInformation,
  WebsiteInformationSchema,
} from '../modules/website-information/schemas/website-information.schema';

import { Role, RoleSchema } from '../modules/auth/schemas/role.schema';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
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
      {
        name: WebsiteInformation.name,
        useFactory: () => {
          const schema = WebsiteInformationSchema;
          return schema;
        },
      },
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          return schema;
        },
      },
      {
        name: Role.name,
        useFactory: () => {
          const schema = RoleSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [GenerateFakeDataService, GenerateInitialDataService],
  exports: [GenerateFakeDataService, GenerateInitialDataService],
})
export class GenerateDataModule {}
