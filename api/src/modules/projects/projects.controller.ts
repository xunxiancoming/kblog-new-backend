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
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectVo, ProjectStatsVo } from "./vo";

@ApiTags("项目管理")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建项目" })
  @ApiResponse({
    status: 201,
    description: "创建成功",
    type: ProjectVo,
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: "获取项目列表" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: [ProjectVo],
  })
  findAll(@Query("featured") featured?: string) {
    return this.projectsService.findAll(featured === "true");
  }

  @Get("featured")
  @ApiOperation({ summary: "获取推荐项目" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: [ProjectVo],
  })
  getFeaturedProjects() {
    return this.projectsService.getFeaturedProjects();
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取项目统计" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: ProjectStatsVo,
  })
  getProjectStats() {
    return this.projectsService.getProjectStats();
  }

  @Get(":id")
  @ApiOperation({ summary: "根据ID获取项目" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: ProjectVo,
  })
  @ApiResponse({ status: 404, description: "项目不存在" })
  findById(@Param("id") id: string) {
    return this.projectsService.findById(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新项目" })
  @ApiResponse({
    status: 200,
    description: "更新成功",
    type: ProjectVo,
  })
  @ApiResponse({ status: 404, description: "项目不存在" })
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除项目" })
  @ApiResponse({
    status: 200,
    description: "删除成功",
    type: ProjectVo,
  })
  @ApiResponse({ status: 404, description: "项目不存在" })
  remove(@Param("id") id: string) {
    return this.projectsService.remove(+id);
  }
}
