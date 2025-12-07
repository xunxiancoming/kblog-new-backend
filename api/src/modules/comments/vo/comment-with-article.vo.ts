import { ApiProperty } from "@nestjs/swagger";
import { CommentVo } from "./comment.vo";

/**
 * 文章信息VO
 */
class ArticleInfoVo {
  @ApiProperty({ description: "文章ID" })
  id: number;

  @ApiProperty({ description: "文章标题" })
  title: string;

  @ApiProperty({ description: "文章slug" })
  slug: string;
}

/**
 * 包含文章信息的评论VO
 */
export class CommentWithArticleVo extends CommentVo {
  @ApiProperty({
    description: "文章信息",
    type: ArticleInfoVo,
  })
  article: ArticleInfoVo;
}
