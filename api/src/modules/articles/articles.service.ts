import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { CreateArticleDto, UpdateArticleDto, QueryArticleDto } from "./dto";
import { Article, ArticleTag } from "@prisma/client";
import { QueryArticleVo } from "./vo/query-article.vo";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    const { tagIds, ...articleData } = createArticleDto;

    // 生成 slug
    const slug = this.generateSlug(articleData.title);

    // 检查 slug 是否已存在
    const existingArticle = await this.prisma.article.findUnique({
      where: { slug },
    });

    // 准备创建数据
    const createData: any = {
      title: articleData.title,
      content: articleData.content,
      slug: existingArticle ? `${slug}-${Date.now()}` : slug,
    };

    // 添加可选字段
    if (articleData.summary) {
      createData.summary = articleData.summary;
    }
    if (articleData.coverImage) {
      createData.coverImage = articleData.coverImage;
    }
    if (articleData.status) {
      createData.status = articleData.status;
    }

    // 处理发布状态
    if (articleData.status === "PUBLISHED") {
      createData.isPublished = true;
      createData.publishedAt = new Date();
    }

    // 创建文章
    const article = await this.prisma.article.create({
      data: createData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 如果有标签，创建关联
    if (tagIds && tagIds.length > 0) {
      await this.createArticleTags(article.id, tagIds);
    }

    return this.findById(article.id);
  }

  async findAll(query: QueryArticleDto): Promise<QueryArticleVo> {
    const { page = 1, limit = 10, keyword, status, tagId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
        { summary: { contains: keyword } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    // 转换数据为 VO 结构
    const data = articles.map((article) => ({
      ...article,
      tags: article.tags.map((tagRelation) => ({
        id: tagRelation.id,
        articleId: tagRelation.articleId,
        tagId: tagRelation.tagId,
        createdAt: tagRelation.createdAt,
        tag: {
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
          color: tagRelation.tag.color || "",
          createdAt: tagRelation.tag.createdAt,
          updatedAt: tagRelation.tag.updatedAt,
        },
      })),
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 转换数据为 VO 结构
    return {
      ...article,
      tags: article.tags.map((tagRelation) => ({
        id: tagRelation.id,
        articleId: tagRelation.articleId,
        tagId: tagRelation.tagId,
        createdAt: tagRelation.createdAt,
        tag: {
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
          color: tagRelation.tag.color || "",
          createdAt: tagRelation.tag.createdAt,
          updatedAt: tagRelation.tag.updatedAt,
        },
      })),
    };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 增加阅读数
    await this.incrementViewCount(article.id);

    // 转换数据为 VO 结构
    return {
      ...article,
      tags: article.tags.map((tagRelation) => ({
        id: tagRelation.id,
        articleId: tagRelation.articleId,
        tagId: tagRelation.tagId,
        createdAt: tagRelation.createdAt,
        tag: {
          id: tagRelation.tag.id,
          name: tagRelation.tag.name,
          color: tagRelation.tag.color || "",
          createdAt: tagRelation.tag.createdAt,
          updatedAt: tagRelation.tag.updatedAt,
        },
      })),
    };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findById(id);

    const { tagIds, ...updateData } = updateArticleDto;

    // 处理发布状态
    if (updateData.status === "PUBLISHED" && !article.isPublished) {
      updateData["isPublished"] = true;
      updateData["publishedAt"] = new Date();
    } else if (updateData.status === "DRAFT") {
      updateData["isPublished"] = false;
    }

    // 更新文章
    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 更新标签关联
    if (tagIds !== undefined) {
      await this.updateArticleTags(id, tagIds);
    }

    return this.findById(id);
  }

  async remove(id: number) {
    const article = await this.findById(id);

    return this.prisma.article.delete({
      where: { id },
    });
  }

  async incrementViewCount(id: number) {
    return this.prisma.article.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // 移除特殊字符
      .replace(/\s+/g, "-") // 空格替换为短横线
      .replace(/-+/g, "-"); // 多个短横线替换为一个
  }

  private async createArticleTags(articleId: number, tagIds: number[]) {
    const articleTags = tagIds.map((tagId) => ({
      articleId,
      tagId,
    }));

    return this.prisma.articleTag.createMany({
      data: articleTags,
    });
  }

  private async updateArticleTags(articleId: number, tagIds: number[]) {
    // 删除现有关联
    await this.prisma.articleTag.deleteMany({
      where: { articleId },
    });

    // 创建新关联
    if (tagIds.length > 0) {
      await this.createArticleTags(articleId, tagIds);
    }
  }
}
