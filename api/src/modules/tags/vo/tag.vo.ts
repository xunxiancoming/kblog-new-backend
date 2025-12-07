import { ApiProperty } from "@nestjs/swagger";

export class TagVo {
  @ApiProperty({ description: "标签ID" })
  id: number;

  @ApiProperty({ description: "标签名称" })
  name: string;

  @ApiProperty({ description: "标签颜色", required: false })
  color: string;

  @ApiProperty({ description: "创建时间" })
  createdAt: Date;

  @ApiProperty({ description: "更新时间" })
  updatedAt: Date;
}
