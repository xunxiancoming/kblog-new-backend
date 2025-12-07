import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { CreateProfileDto, UpdateProfileDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProfileVo } from "./vo";

@ApiTags("个人信息管理")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建个人信息" })
  @ApiResponse({ status: 201, description: "创建成功", type: ProfileVo })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: "获取个人信息" })
  @ApiResponse({ status: 200, description: "获取成功", type: ProfileVo })
  findOne() {
    return this.profileService.findOne();
  }

  @Get("all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取所有个人信息记录" })
  @ApiResponse({ status: 200, description: "获取成功", type: [ProfileVo] })
  findAll() {
    return this.profileService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新个人信息（更新第一个记录）" })
  @ApiResponse({ status: 200, description: "更新成功", type: ProfileVo })
  updateFirst(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateFirst(updateProfileDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "根据ID更新个人信息" })
  @ApiResponse({ status: 200, description: "更新成功", type: ProfileVo })
  @ApiResponse({ status: 404, description: "个人信息不存在" })
  update(@Param("id") id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除个人信息" })
  @ApiResponse({ status: 200, description: "删除成功", type: ProfileVo })
  remove(@Param("id") id: string) {
    return this.profileService.remove(+id);
  }
}
