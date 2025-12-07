import { ApiProperty } from "@nestjs/swagger";

/**
 * 文章活动项VO
 */
export class ArticleActivityVo {
  @ApiProperty({ description: "文章ID", example: 1 })
  id: number;

  @ApiProperty({ description: "文章标题", example: "我的第一篇文章" })
  title: string;

  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "活动类型", example: "article" })
  type: "article";
}

/**
 * 评论活动项VO
 */
export class CommentActivityVo {
  @ApiProperty({ description: "评论ID", example: 1 })
  id: number;

  @ApiProperty({ description: "评论作者", example: "张三" })
  author: string;

  @ApiProperty({ description: "评论内容", example: "这是一条评论" })
  content: string;

  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "活动类型", example: "comment" })
  type: "comment";

  @ApiProperty({ description: "关联文章信息" })
  article: {
    id: number;
    title: string;
  };
}

/**
 * 项目活动项VO
 */
export class ProjectActivityVo {
  @ApiProperty({ description: "项目ID", example: 1 })
  id: number;

  @ApiProperty({ description: "项目标题", example: "我的项目" })
  title: string;

  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "活动类型", example: "project" })
  type: "project";
}

/**
 * 最近活动VO（联合类型）
 */
export type RecentActivityVo =
  | ArticleActivityVo
  | CommentActivityVo
  | ProjectActivityVo;
