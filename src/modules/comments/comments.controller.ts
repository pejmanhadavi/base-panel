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
import { FilterQueryDto } from '../../common/dto/filterQuery.dto';
import { CommentsService } from './comments.service';
import { CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import permissions from '../../constants/permissions.constant';

@ApiBearerAuth()
@ApiTags('comments')
@UseGuards(AuthGuard('jwt'))
@Controller('comments')
@UseGuards(RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse()
  async getAllProducts(
    @Query() filterQueryDto: FilterQueryDto,
  ): Promise<CommentDocument[]> {
    return await this.commentsService.getAll(filterQueryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiParam({ name: 'id', required: true })
  async getUserById(@Param('id') code: number): Promise<CommentDocument> {
    return await this.commentsService.getById(code);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  @ApiOperation({ summary: 'Create comment' })
  async createUser(@Body() createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    return await this.commentsService.create(createCommentDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update comment' })
  @ApiOkResponse()
  @Roles(permissions.UPDATE_COMMENT)
  @ApiParam({ name: 'id', required: true })
  async updateUser(
    @Param('id') code: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDocument> {
    return await this.commentsService.update(code, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @Roles(permissions.DELETE_COMMENT)
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', required: true })
  async deleteUser(@Param('id') code: number): Promise<void> {
    return this.commentsService.delete(code);
  }
}
