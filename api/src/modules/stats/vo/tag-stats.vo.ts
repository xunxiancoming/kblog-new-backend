import { ApiProperty } from "@nestjs/swagger";

/**
 * 标签统计VO
 */
export class TagStatsVo {
  @ApiProperty({ description: "标签ID", example: 1 })
  id: number;

  @ApiProperty({ description: "标签名称", example: "JavaScript" })
  name: string;

  @ApiProperty({ description: "标签颜色", example: "#007bff", required: false })
  color?: string;

  @ApiProperty({ description: "文章数量", example: 10 })
  articleCount: number;
}
