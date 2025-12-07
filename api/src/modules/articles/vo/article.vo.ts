import { ApiProperty } from "@nestjs/swagger";

export class ArticleVo {
  @ApiProperty({ description: "文章摘要" })
  summary: string;

  @ApiProperty({ description: "文章内容" })
  content: string;

  @ApiProperty({ description: "文章标题" })
  title: string;

  @ApiProperty({ description: "文章slug" })
  slug: string;

  @ApiProperty({ description: "封面图片", required: false })
  coverImage: string;

  @ApiProperty({ description: "阅读数" })
  viewCount: number;

  @ApiProperty({ description: "文章状态" })
  status: string;

  @ApiProperty({ description: "是否已发布" })
  isPublished: boolean;

  @ApiProperty({ description: "发布时间", required: false })
  publishedAt: Date;

  @ApiProperty({ description: "创建时间" })
  createdAt: Date;

  @ApiProperty({ description: "更新时间" })
  updatedAt: Date;

  @ApiProperty({ description: "文章ID" })
  id: number;
}
