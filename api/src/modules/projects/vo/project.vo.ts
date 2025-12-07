import { ApiProperty } from "@nestjs/swagger";

/**
 * 项目VO
 */
export class ProjectVo {
  @ApiProperty({ description: "项目ID" })
  id: number;

  @ApiProperty({ description: "项目标题" })
  title: string;

  @ApiProperty({ description: "项目描述" })
  description: string;

  @ApiProperty({ description: "项目图片URL", required: false })
  imageUrl: string;

  @ApiProperty({ description: "项目URL", required: false })
  projectUrl: string;

  @ApiProperty({ description: "GitHub URL", required: false })
  githubUrl: string;

  @ApiProperty({
    description: "技术栈（JSON格式）",
    required: false,
    example: '["React", "TypeScript", "Node.js"]',
  })
  techStack: string;

  @ApiProperty({ description: "是否推荐" })
  featured: boolean;

  @ApiProperty({ description: "创建时间" })
  createdAt: Date;

  @ApiProperty({ description: "更新时间" })
  updatedAt: Date;
}
