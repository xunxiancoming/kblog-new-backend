import { ApiProperty } from "@nestjs/swagger";
import { TagVo } from "./tag.vo";

/**
 * 包含文章计数的标签VO
 */
export class TagWithCountVo extends TagVo {
  @ApiProperty({
    description: "文章数量统计",
    example: { articles: 5 },
  })
  _count: {
    articles: number;
  };
}
