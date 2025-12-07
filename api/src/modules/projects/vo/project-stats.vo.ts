import { ApiProperty } from "@nestjs/swagger";

/**
 * 项目统计VO
 */
export class ProjectStatsVo {
  @ApiProperty({ description: "项目总数" })
  total: number;

  @ApiProperty({ description: "推荐项目数" })
  featured: number;
}
