import { ApiProperty } from "@nestjs/swagger";

/**
 * 月度统计数据项VO
 */
class MonthlyDataItemVo {
  @ApiProperty({ description: "月份 (1-12)", example: 1 })
  month: number;

  @ApiProperty({ description: "文章数量", example: 10 })
  articles: number;

  @ApiProperty({ description: "评论数量", example: 50 })
  comments: number;

  @ApiProperty({ description: "阅读量", example: 1000 })
  views: number;
}

/**
 * 月度统计VO
 */
export class MonthlyStatsVo {
  @ApiProperty({ description: "年份", example: 2024 })
  year: number;

  @ApiProperty({ description: "月度数据", type: [MonthlyDataItemVo] })
  data: MonthlyDataItemVo[];
}
