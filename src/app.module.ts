import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './interceptors/ errors.interceptor';
import { GenerateDataModule } from './generate-data/generate-data.module';
import { AdminLogsModule } from './modules/admin-logs/admin-logs.module';
import { WebsiteInformationModule } from './modules/website-information/website-information.module';
import { CategoriesModule } from './modules/categories/categories.module';
import sequencePlugin from './common/plugins/squence.plugin';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
        connectionName: 'base-store',
        useCreateIndex: true,
        useNewUrlParser: true,
        connectionFactory: (connection) => {
          connection.plugin(sequencePlugin);
          return connection;
        },
      }),
    }),
    AuthModule,
    UsersModule,
    GenerateDataModule,
    AdminLogsModule,
    WebsiteInformationModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
