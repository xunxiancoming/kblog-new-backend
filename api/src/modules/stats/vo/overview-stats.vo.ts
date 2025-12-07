import { ApiProperty } from "@nestjs/swagger";

/**
 * 总览统计VO
 */
export class OverviewStatsVo {
  @ApiProperty({ description: "文章总数", example: 100 })
  articles: number;

  @ApiProperty({ description: "评论总数", example: 500 })
  comments: number;

  @ApiProperty({ description: "标签总数", example: 20 })
  tags: number;

  @ApiProperty({ description: "项目总数", example: 10 })
  projects: number;

  @ApiProperty({ description: "总阅读量", example: 10000 })
  totalViews: number;

  @ApiProperty({ description: "待审核评论数", example: 5 })
  pendingComments: number;
}
