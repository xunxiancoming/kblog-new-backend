import { ApiProperty } from "@nestjs/swagger";

/**
 * 评论VO
 */
export class CommentVo {
  @ApiProperty({ description: "评论ID" })
  id: number;

  @ApiProperty({ description: "评论内容" })
  content: string;

  @ApiProperty({ description: "评论作者" })
  author: string;

  @ApiProperty({ description: "评论者邮箱" })
  email: string;

  @ApiProperty({ description: "评论者网站", required: false })
  website: string;

  @ApiProperty({ description: "IP地址", required: false })
  ip: string;

  @ApiProperty({ description: "用户代理", required: false })
  userAgent: string;

  @ApiProperty({
    description: "评论状态",
    enum: ["PENDING", "APPROVED", "REJECTED"],
  })
  status: string;

  @ApiProperty({ description: "创建时间" })
  createdAt: Date;

  @ApiProperty({ description: "更新时间" })
  updatedAt: Date;

  @ApiProperty({ description: "文章ID" })
  articleId: number;
}
