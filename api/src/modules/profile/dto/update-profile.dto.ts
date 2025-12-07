import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: '个人标题', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '个人简介', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'GitHub链接', required: false })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({ description: 'Twitter链接', required: false })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ description: 'LinkedIn链接', required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '电话', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '地址', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}