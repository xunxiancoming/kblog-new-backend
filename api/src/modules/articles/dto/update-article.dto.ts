import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto {
  @ApiProperty({ description: '文章标题', required: false })
  @IsOptional()
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  title?: string;

  @ApiProperty({ description: '文章内容', required: false })
  @IsOptional()
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content?: string;

  @ApiProperty({ description: '文章摘要', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: '文章封面图', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: '状态 (DRAFT: 草稿, PUBLISHED: 已发布)', required: false })
  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PUBLISHED';

  @ApiProperty({ description: '标签ID数组', required: false })
  @IsOptional()
  @IsArray()
  tagIds?: number[];
}