import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configurations
  const options = new DocumentBuilder()
    .setTitle('Base store')
    .setDescription('Base store APIs')
    .setVersion('1.0')
    .addTag('base-store')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

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
