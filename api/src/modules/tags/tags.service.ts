import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;

    // 检查标签名是否已存在
    const existingTag = await this.prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      throw new ConflictException('标签名称已存在');
    }

    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findById(id);

    if (updateTagDto.name) {
      // 检查标签名是否已存在
      const existingTag = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name },
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('标签名称已存在');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  async remove(id: number) {
    const tag = await this.findById(id);

    return this.prisma.tag.delete({
      where: { id },
    });
  }

  async findPopular(limit: number = 10) {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }
}