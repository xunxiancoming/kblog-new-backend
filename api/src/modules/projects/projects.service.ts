import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async findAll(featured?: boolean) {
    const where: any = {};

    if (featured !== undefined) {
      where.featured = featured;
    }

    return this.prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findById(id);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    const project = await this.findById(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getFeaturedProjects() {
    return this.findAll(true);
  }

  async getProjectStats() {
    const [total, featured] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { featured: true } }),
    ]);

    return {
      total,
      featured,
    };
  }
}