import { ApiProperty } from "@nestjs/swagger";

/**
 * 评论统计VO
 */
export class CommentStatsVo {
  @ApiProperty({ description: "评论总数" })
  total: number;

  @ApiProperty({ description: "待审核评论数" })
  pending: number;

  @ApiProperty({ description: "已通过评论数" })
  approved: number;

  @ApiProperty({ description: "已拒绝评论数" })
  rejected: number;
}
