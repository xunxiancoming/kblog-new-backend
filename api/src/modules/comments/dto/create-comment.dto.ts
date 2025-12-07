import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '文章ID' })
  @IsNotEmpty({ message: '文章ID不能为空' })
  articleId: number;

  @ApiProperty({ description: '评论者姓名' })
  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString()
  author: string;

  @ApiProperty({ description: '评论者邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '个人网站', required: false })
  @IsOptional()
  @IsString()
  website?: string;
}