import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      articleCount,
      commentCount,
      tagCount,
      projectCount,
      totalViews,
      pendingComments,
    ] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.comment.count(),
      this.prisma.tag.count(),
      this.prisma.project.count(),
      this.getArticleViewStats(),
      this.prisma.comment.count({ where: { status: "PENDING" } }),
    ]);

    return {
      articles: articleCount,
      comments: commentCount,
      tags: tagCount,
      projects: projectCount,
      totalViews,
      pendingComments,
    };
  }

  async getArticleStats() {
    const [publishedCount, draftCount, totalCount] = await Promise.all([
      this.prisma.article.count({ where: { status: "PUBLISHED" } }),
      this.prisma.article.count({ where: { status: "DRAFT" } }),
      this.prisma.article.count(),
    ]);

    const articles = await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        viewCount: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { viewCount: "desc" },
      take: 10,
    });

    return {
      published: publishedCount,
      draft: draftCount,
      total: totalCount,
      topViewed: articles,
    };
  }

  async getArticleViewStats() {
    const result = await this.prisma.article.aggregate({
      _sum: {
        viewCount: true,
      },
    });

    return result._sum.viewCount || 0;
  }

  async getMonthlyStats(year?: number) {
    const currentYear = year || new Date().getFullYear();

    // 获取月度文章数量统计
    const articleStats = await this.prisma.$queryRaw`
      SELECT
        MONTH(createdAt) as month,
        COUNT(*) as count
      FROM articles
      WHERE YEAR(createdAt) = ${currentYear}
      GROUP BY MONTH(createdAt)
      ORDER BY month
    `;

    // 获取月度评论数量统计
    const commentStats = await this.prisma.$queryRaw`
      SELECT
        MONTH(createdAt) as month,
        COUNT(*) as count
      FROM comments
      WHERE YEAR(createdAt) = ${currentYear}
      GROUP BY MONTH(createdAt)
      ORDER BY month
    `;

    // 获取月度阅读量统计
    const viewStats = await this.prisma.$queryRaw`
      SELECT
        MONTH(createdAt) as month,
        SUM(viewCount) as total
      FROM articles
      WHERE YEAR(createdAt) = ${currentYear}
      GROUP BY MONTH(createdAt)
      ORDER BY month
    `;

    // 将数据格式化为月份键值对
    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = {
        month: i,
        articles: 0,
        comments: 0,
        views: 0,
      };

      const articleData = (articleStats as any[]).find(
        (item) => item.month === i
      );
      if (articleData) {
        monthData.articles = Number(articleData.count);
      }

      const commentData = (commentStats as any[]).find(
        (item) => item.month === i
      );
      if (commentData) {
        monthData.comments = Number(commentData.count);
      }

      const viewData = (viewStats as any[]).find((item) => item.month === i);
      if (viewData) {
        monthData.views = Number(viewData.total);
      }

      monthlyData.push(monthData);
    }

    return {
      year: currentYear,
      data: monthlyData,
    };
  }

  async getTagStats() {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      articleCount: tag._count.articles,
    }));
  }

  async getRecentActivity() {
    const [recentArticles, recentComments, recentProjects] = await Promise.all([
      this.prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      this.prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          author: true,
          content: true,
          createdAt: true,
          article: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
    ]);

    // 添加类型字段并合并所有活动
    const articlesWithType = recentArticles.map((article) => ({
      ...article,
      type: "article" as const,
    }));

    const commentsWithType = recentComments.map((comment) => ({
      ...comment,
      type: "comment" as const,
    }));

    const projectsWithType = recentProjects.map((project) => ({
      ...project,
      type: "project" as const,
    }));

    // 合并所有活动并按时间排序
    const allActivities = [
      ...articlesWithType,
      ...commentsWithType,
      ...projectsWithType,
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return {
      items: allActivities,
    };
  }
}
