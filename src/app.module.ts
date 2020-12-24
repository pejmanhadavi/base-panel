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
import { SmsModule } from './modules/sms/sms.module';
import { EmailModule } from './modules/email/email.module';
import { BannersModule } from './modules/banners/banners.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { ProductsModule } from './modules/products/products.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { BasketsModule } from './modules/baskets/baskets.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BrandsModule } from './modules/brands/brands.module';
import { QsAsModule } from './modules/qs-as/qs-as.module';
import { CommentsModule } from './modules/comments/comments.module';
import sequencePlugin from './common/plugins/sequence.plugin';

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
    SmsModule,
    EmailModule,
    BannersModule,
    ArticlesModule,
    ProductsModule,
    CouponsModule,
    BasketsModule,
    OrdersModule,
    PaymentsModule,
    TransactionsModule,
    BrandsModule,
    QsAsModule,
    CommentsModule,
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
