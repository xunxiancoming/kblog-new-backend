import { ApiProperty } from "@nestjs/swagger";
import { PaginationVo } from "@/common/vo/pagination.vo";
import { ArticleWithTagsVo } from "./article-with-tags.vo";

export class QueryArticleVo {
  @ApiProperty({ description: "文章列表", type: () => [ArticleWithTagsVo] })
  data: ArticleWithTagsVo[];

  @ApiProperty({ description: "分页信息", type: () => PaginationVo })
  pagination: PaginationVo;
}
