import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { TagsService } from "./tags.service";
import { CreateTagDto, UpdateTagDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TagVo } from "./vo/tag.vo";
import { TagWithCountVo } from "./vo/tag-with-count.vo";

@ApiTags("标签管理")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建标签" })
  @ApiResponse({
    status: 201,
    description: "创建成功",
    type: TagVo,
  })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: "获取标签列表" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: [TagWithCountVo],
  })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get("popular")
  @ApiOperation({ summary: "获取热门标签" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: [TagWithCountVo],
  })
  findPopular(@Query("limit") limit?: string) {
    return this.tagsService.findPopular(limit ? +limit : 10);
  }

  @Get(":id")
  @ApiOperation({ summary: "根据ID获取标签" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: TagWithCountVo,
  })
  @ApiResponse({ status: 404, description: "标签不存在" })
  findById(@Param("id") id: string) {
    return this.tagsService.findById(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新标签" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
    type: TagVo,
  })
  @ApiResponse({ status: 404, description: "标签不存在" })
  update(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除标签" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
    type: TagVo,
  })
  @ApiResponse({ status: 404, description: "标签不存在" })
  remove(@Param("id") id: string) {
    return this.tagsService.remove(+id);
  }
}
