import { ApiProperty } from "@nestjs/swagger";

export class PaginationVo {
  @ApiProperty({ description: "当前页码" })
  page: number;

  @ApiProperty({ description: "每页数量" })
  limit: number;

  @ApiProperty({ description: "总记录数" })
  total: number;

  @ApiProperty({ description: "总页数" })
  totalPages: number;
}
