import { ApiProperty } from "@nestjs/swagger";

/**
 * 文章统计项VO
 */
class ArticleStatsItemVo {
  @ApiProperty({ description: "文章ID", example: 1 })
  id: number;

  @ApiProperty({ description: "文章标题", example: "我的第一篇文章" })
  title: string;

  @ApiProperty({ description: "阅读量", example: 100 })
  viewCount: number;

  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "评论数", example: 5 })
  comments: number;
}

/**
 * 文章统计VO
 */
export class ArticleStatsVo {
  @ApiProperty({ description: "已发布文章数", example: 80 })
  published: number;

  @ApiProperty({ description: "草稿文章数", example: 20 })
  draft: number;

  @ApiProperty({ description: "文章总数", example: 100 })
  total: number;

  @ApiProperty({ description: "热门文章列表", type: [ArticleStatsItemVo] })
  topViewed: ArticleStatsItemVo[];
}
