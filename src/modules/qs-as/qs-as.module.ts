import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { QsAsController } from './qs-as.controller';
import { QsAsService } from './qs-as.service';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Question.name,
        useFactory: () => {
          const schema = QuestionSchema;
          return schema;
        },
      },
      {
        name: Answer.name,
        useFactory: () => {
          const schema = AnswerSchema;
          return schema;
        },
      },
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [QsAsController],
  providers: [QsAsService],
})
export class QsAsModule {}
