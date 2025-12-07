import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class QueryCommentDto {
  @ApiProperty({ description: "页码", required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: "每页数量", required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: "文章ID筛选", required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  articleId?: number;

  @ApiProperty({ description: "状态筛选", required: false })
  @IsOptional()
  @IsString()
  status?: "PENDING" | "APPROVED" | "REJECTED";

  @ApiProperty({
    description: "搜索关键词（昵称、邮箱、内容）",
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
