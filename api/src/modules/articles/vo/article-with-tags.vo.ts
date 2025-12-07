import { ApiProperty } from "@nestjs/swagger";
import { ArticleVo } from "./article.vo";
import { ArticleTagVo } from "./article-tag.vo";

export class ArticleWithTagsVo extends ArticleVo {
  @ApiProperty({ description: "标签列表", type: () => [ArticleTagVo] })
  tags: ArticleTagVo[];

  @ApiProperty({ description: "统计信息" })
  _count: {
    comments: number;
  };
}
