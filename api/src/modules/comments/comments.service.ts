import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateCommentDto, UpdateCommentDto, QueryCommentDto } from "./dto";
import { QueryCommentVo } from "./vo/query-comment.vo";

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const { articleId, ...commentData } = createCommentDto;

    // 检查文章是否存在
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 获取客户端信息（这里简化处理，实际应用中可以从请求中获取）
    const clientInfo = {
      ip: "", // 实际中从 req.ip 获取
      userAgent: "", // 实际中从 req.get('User-Agent') 获取
    };

    return this.prisma.comment.create({
      data: {
        ...commentData,
        articleId,
        ...clientInfo,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryCommentDto): Promise<QueryCommentVo> {
    const { page = 1, limit = 10, articleId, status, keyword } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (articleId) {
      where.articleId = articleId;
    }

    if (status) {
      where.status = status;
    }

    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword } },
        { email: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException("评论不存在");
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findById(id);

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async approve(id: number) {
    return this.update(id, { status: "APPROVED" });
  }

  async reject(id: number) {
    return this.update(id, { status: "REJECTED" });
  }

  async remove(id: number) {
    const comment = await this.findById(id);

    return this.prisma.comment.delete({
      where: { id },
    });
  }

  async getPendingComments(query?: QueryCommentDto) {
    return this.findAll({ ...query, status: "PENDING" });
  }

  async getApprovedComments(query?: QueryCommentDto) {
    return this.findAll({ ...query, status: "APPROVED" });
  }

  async getCommentStats(articleId?: number) {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.comment.count({ where: { articleId } }),
      this.prisma.comment.count({ where: { articleId, status: "PENDING" } }),
      this.prisma.comment.count({ where: { articleId, status: "APPROVED" } }),
      this.prisma.comment.count({ where: { articleId, status: "REJECTED" } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }
}
