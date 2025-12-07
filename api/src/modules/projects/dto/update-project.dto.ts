import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ description: '项目标题', required: false })
  @IsOptional()
  @IsNotEmpty({ message: '项目标题不能为空' })
  @IsString()
  title?: string;

  @ApiProperty({ description: '项目描述', required: false })
  @IsOptional()
  @IsNotEmpty({ message: '项目描述不能为空' })
  @IsString()
  description?: string;

  @ApiProperty({ description: '项目图片', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: '项目链接', required: false })
  @IsOptional()
  @IsString()
  projectUrl?: string;

  @ApiProperty({ description: 'GitHub链接', required: false })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({ description: '技术栈', required: false })
  @IsOptional()
  @IsString()
  techStack?: string;

  @ApiProperty({ description: '是否推荐', required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}