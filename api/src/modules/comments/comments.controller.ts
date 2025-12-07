import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto, UpdateCommentDto, QueryCommentDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  CommentVo,
  CommentWithArticleVo,
  CommentStatsVo,
  QueryCommentVo,
} from "./vo";

@ApiTags("评论管理")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: "创建评论" })
  @ApiResponse({
    status: 201,
    description: "创建成功",
    type: CommentWithArticleVo,
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: "获取评论列表" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: QueryCommentVo,
  })
  findAll(@Query() query: QueryCommentDto) {
    return this.commentsService.findAll(query);
  }

  @Get("pending")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取待审核评论" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: QueryCommentVo,
  })
  getPendingComments(@Query() query: QueryCommentDto) {
    return this.commentsService.getPendingComments(query);
  }

  @Get("approved")
  @ApiOperation({ summary: "获取已通过评论" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: QueryCommentVo,
  })
  getApprovedComments(@Query() query: QueryCommentDto) {
    return this.commentsService.getApprovedComments(query);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取评论统计" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: CommentStatsVo,
  })
  getCommentStats(@Query("articleId") articleId?: number) {
    return this.commentsService.getCommentStats(articleId);
  }

  @Get(":id")
  @ApiOperation({ summary: "根据ID获取评论" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: CommentWithArticleVo,
  })
  @ApiResponse({ status: 404, description: "评论不存在" })
  findById(@Param("id") id: string) {
    return this.commentsService.findById(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新评论" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
    type: CommentWithArticleVo,
  })
  @ApiResponse({ status: 404, description: "评论不存在" })
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Patch(":id/approve")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "审核通过评论" })
  @ApiResponse({
    status: 200,
    description: "审核成功",
    type: CommentWithArticleVo,
  })
  approve(@Param("id") id: string) {
    return this.commentsService.approve(+id);
  }

  @Patch(":id/reject")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "拒绝评论" })
  @ApiResponse({
    status: 200,
    description: "操作成功",
    type: CommentWithArticleVo,
  })
  reject(@Param("id") id: string) {
    return this.commentsService.reject(+id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除评论" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
    type: CommentVo,
  })
  @ApiResponse({ status: 404, description: "评论不存在" })
  remove(@Param("id") id: string) {
    return this.commentsService.remove(+id);
  }
}
