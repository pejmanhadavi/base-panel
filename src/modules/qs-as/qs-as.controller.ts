import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import permissions from '../../constants/permissions.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { QsAsService } from './qs-as.service';
import { QuestionDocument } from './schemas/question.schema';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerDocument } from './schemas/answer.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@ApiBearerAuth()
@ApiTags('qs-as')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('qs-as')
export class QsAsController {
  constructor(private readonly QsAsService: QsAsService) {}
  // *************** Question methods ***************
  @Get('questions')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_Question)
  @ApiOperation({ summary: 'Get all questions' })
  @ApiOkResponse()
  async getAllQuestions(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<QuestionDocument[]> {
    return await this.QsAsService.getAllQuestions(filterQueryDto);
  }

  @Get('questions/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_Question)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a question instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getByQuestionId(@Param('id') code: number): Promise<QuestionDocument> {
    return await this.QsAsService.getQuestionById(code);
  }

  @Patch('questions/:id')
  @Roles(permissions.UPDATE_Question)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update question' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async updateQuestion(
    @Param('id') code: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDocument> {
    return await this.QsAsService.updateQuestion(code, updateQuestionDto);
  }

  @Delete('questions/:id')
  @Roles(permissions.DELETE_Question)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete question' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async deleteQuestion(@Param('id') code: number): Promise<void> {
    return this.QsAsService.deleteQuestion(code);
  }

  // *************** Answer methods ***************
  @Get('answers')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_ANSWER)
  @ApiOperation({ summary: 'Get all answers' })
  @ApiOkResponse()
  async getAllAnswers(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<AnswerDocument[]> {
    return await this.QsAsService.getAllAnswers(filterQueryDto);
  }

  @Get('answers/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.READ_ANSWER)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a answer instance by id' })
  @ApiParam({ name: 'id', required: true })
  async getAnswerById(@Param('id') code: number): Promise<AnswerDocument> {
    return await this.QsAsService.getAnswerById(code);
  }

  @Post('answers')
  @Roles(permissions.CREATE_ANSWER)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create answer' })
  async createAnswer(@Body() createAnswerDto: CreateAnswerDto): Promise<AnswerDocument> {
    return await this.QsAsService.createAnswer(createAnswerDto);
  }

  @Patch('answers/:id')
  @Roles(permissions.UPDATE_ANSWER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update answer' })
  @ApiOkResponse()
  @ApiParam({ name: 'id', required: true })
  async update(
    @Param('id') code: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<QuestionDocument> {
    return await this.QsAsService.updateAnswer(code, updateAnswerDto);
  }

  @Delete('answers/:id')
  @Roles(permissions.DELETE_ANSWER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete answer' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') code: number): Promise<void> {
    return this.QsAsService.deleteAnswer(code);
  }
}
