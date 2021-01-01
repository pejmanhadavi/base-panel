import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  // Swagger configurations
  const options = new DocumentBuilder()
    .setTitle('Store')
    .setDescription('Store APIs')
    .setVersion('1.0')
    .addTag('store')
    .addBearerAuth()
    .build();

  // Add security for doc path
  app.use(
    '/api/docs',
    basicAuth({
      challenge: true,
      users: {
        admin: process.env.SWAGGER_PASS,
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document);

  // Class Validator configurations
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true ? process.env.NODE_ENV == 'production' : false,
    }),
  );

  await app.listen(3000);
  Logger.log(`connected to ${process.env.MONGO_URI}`);
}
bootstrap();
