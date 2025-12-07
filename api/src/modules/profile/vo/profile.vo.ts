import { ApiProperty } from "@nestjs/swagger";

/**
 * 个人信息VO
 */
export class ProfileVo {
  @ApiProperty({ description: "ID", example: 1 })
  id: number;

  @ApiProperty({ description: "标题", example: "我的博客", required: false })
  title?: string;

  @ApiProperty({
    description: "头像URL",
    example: "https://example.com/avatar.jpg",
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: "个人简介",
    example: "欢迎来到我的个人博客",
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: "GitHub链接",
    example: "https://github.com/username",
    required: false,
  })
  github?: string;

  @ApiProperty({
    description: "Twitter链接",
    example: "https://twitter.com/username",
    required: false,
  })
  twitter?: string;

  @ApiProperty({
    description: "LinkedIn链接",
    example: "https://linkedin.com/in/username",
    required: false,
  })
  linkedin?: string;

  @ApiProperty({
    description: "邮箱",
    example: "contact@example.com",
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: "电话",
    example: "+86 13800138000",
    required: false,
  })
  phone?: string;

  @ApiProperty({ description: "位置", example: "北京, 中国", required: false })
  location?: string;

  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "更新时间", example: "2024-01-01T00:00:00.000Z" })
  updatedAt: Date;
}
