import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    // 检查是否已存在个人信息
    const existingProfile = await this.prisma.profile.findFirst();

    if (existingProfile) {
      throw new Error('个人信息已存在，请使用更新接口');
    }

    return this.prisma.profile.create({
      data: createProfileDto,
    });
  }

  async findAll() {
    return this.prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne() {
    // 获取第一个（唯一）的个人信息记录
    const profile = await this.prisma.profile.findFirst();

    if (!profile) {
      // 如果不存在，返回一个默认的个人信息
      return this.create({
        title: '我的博客',
        bio: '欢迎来到我的个人博客',
        email: '',
      });
    }

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new Error('个人信息不存在');
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async updateFirst(updateProfileDto: UpdateProfileDto) {
    // 获取第一个个人信息记录
    const profile = await this.prisma.profile.findFirst();

    if (!profile) {
      // 如果不存在，创建一个新的
      return this.create(updateProfileDto);
    }

    // 更新现有的
    return this.update(profile.id, updateProfileDto);
  }

  async remove(id: number) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}