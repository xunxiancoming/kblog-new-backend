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
import { ArticlesService } from "./articles.service";
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { QueryArticleVo } from "./vo/query-article.vo";
import { ArticleWithTagsVo } from "./vo/article-with-tags.vo";
import { ArticleVo } from "./vo/article.vo";

@ApiTags("文章管理")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建文章" })
  @ApiResponse({
    status: 201,
    description: "创建成功",
    type: ArticleWithTagsVo,
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: "获取文章列表" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: QueryArticleVo,
  })
  findAll(@Query() query: QueryArticleDto) {
    return this.articlesService.findAll(query);
  }

  @Get("published")
  @ApiOperation({ summary: "获取已发布的文章列表" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: QueryArticleVo,
  })
  findPublished(@Query() query: QueryArticleDto) {
    return this.articlesService.findAll({ ...query, status: "PUBLISHED" });
  }

  @Get(":id")
  @ApiOperation({ summary: "根据ID获取文章" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: ArticleWithTagsVo,
  })
  @ApiResponse({ status: 404, description: "文章不存在" })
  findById(@Param("id") id: string) {
    return this.articlesService.findById(+id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "根据slug获取文章" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: ArticleWithTagsVo,
  })
  @ApiResponse({ status: 404, description: "文章不存在" })
  findBySlug(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新文章" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
    type: ArticleWithTagsVo,
  })
  @ApiResponse({ status: 404, description: "文章不存在" })
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除文章" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
    type: ArticleVo,
  })
  @ApiResponse({ status: 404, description: "文章不存在" })
  remove(@Param("id") id: string) {
    return this.articlesService.remove(+id);
  }
}
