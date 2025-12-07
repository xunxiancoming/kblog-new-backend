import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { StatsService } from "./stats.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  OverviewStatsVo,
  ArticleStatsVo,
  MonthlyStatsVo,
  TagStatsVo,
  RecentActivityListVo,
} from "./vo";

@ApiTags("统计管理")
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("overview")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取总览统计" })
  @ApiResponse({ status: 200, description: "获取成功", type: OverviewStatsVo })
  getOverview() {
    return this.statsService.getOverview();
  }

  @Get("articles")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取文章统计" })
  @ApiResponse({ status: 200, description: "获取成功", type: ArticleStatsVo })
  getArticleStats() {
    return this.statsService.getArticleStats();
  }

  @Get("monthly")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取月度统计" })
  @ApiQuery({
    name: "year",
    required: false,
    description: "年份，默认为当前年份",
  })
  @ApiResponse({ status: 200, description: "获取成功", type: MonthlyStatsVo })
  getMonthlyStats(@Query("year") year?: string) {
    return this.statsService.getMonthlyStats(year ? +year : undefined);
  }

  @Get("tags")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取标签统计" })
  @ApiResponse({ status: 200, description: "获取成功", type: [TagStatsVo] })
  getTagStats() {
    return this.statsService.getTagStats();
  }

  @Get("recent-activity")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取最近活动" })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    type: RecentActivityListVo,
  })
  getRecentActivity() {
    return this.statsService.getRecentActivity();
  }
}
