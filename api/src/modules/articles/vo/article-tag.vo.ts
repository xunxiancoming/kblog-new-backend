import { ApiProperty } from "@nestjs/swagger";
import { TagVo } from "@/modules/tags/vo/tag.vo";

export class ArticleTagVo {
  @ApiProperty({ description: "关联ID" })
  id: number;

  @ApiProperty({ description: "文章ID" })
  articleId: number;

  @ApiProperty({ description: "标签ID" })
  tagId: number;

  @ApiProperty({ description: "创建时间" })
  createdAt: Date;

  @ApiProperty({ description: "标签信息", type: () => TagVo })
  tag: TagVo;
}
