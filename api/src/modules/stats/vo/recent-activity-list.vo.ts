import { ApiProperty } from "@nestjs/swagger";
import { ArticleActivityVo } from "./recent-activity.vo";
import { CommentActivityVo } from "./recent-activity.vo";
import { ProjectActivityVo } from "./recent-activity.vo";

/**
 * 最近活动列表VO
 */
export class RecentActivityListVo {
  @ApiProperty({
    description: "最近活动列表",
    type: () => [Object],
    example: [
      {
        id: 1,
        title: "我的第一篇文章",
        createdAt: "2024-01-01T00:00:00.000Z",
        type: "article",
      },
      {
        id: 1,
        author: "张三",
        content: "这是一条评论",
        createdAt: "2024-01-01T00:00:00.000Z",
        type: "comment",
        article: {
          id: 1,
          title: "我的第一篇文章",
        },
      },
      {
        id: 1,
        title: "我的项目",
        createdAt: "2024-01-01T00:00:00.000Z",
        type: "project",
      },
    ],
  })
  items: (ArticleActivityVo | CommentActivityVo | ProjectActivityVo)[];
}
