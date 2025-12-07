import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: '评论内容', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '状态 (PENDING: 待审核, APPROVED: 已通过, REJECTED: 已拒绝)', required: false })
  @IsOptional()
  @IsString()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}