import { ApiProperty } from "@nestjs/swagger";
import { PaginationVo } from "@/common/vo/pagination.vo";
import { CommentWithArticleVo } from "./comment-with-article.vo";

export class QueryCommentVo {
  @ApiProperty({ description: "评论列表", type: () => [CommentWithArticleVo] })
  data: CommentWithArticleVo[];

  @ApiProperty({ description: "分页信息", type: () => PaginationVo })
  pagination: PaginationVo;
}
