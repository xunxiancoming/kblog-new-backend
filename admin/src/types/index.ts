export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  coverImage?: string;
  viewCount: number;
  status: 'DRAFT' | 'PUBLISHED';
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: ArticleTag[];
  _count: {
    comments: number;
  };
}

export interface ArticleTag {
  id: number;
  articleId: number;
  tagId: number;
  createdAt: string;
  tag: Tag;
}

// 为了兼容API响应，需要扩展这个接口
export interface ArticleTagExtended extends ArticleTag {
  tag: Tag;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    articles: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  email: string;
  website?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  articleId: number;
  article: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  techStack?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  title?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  articles: number;
  comments: number;
  tags: number;
  projects: number;
  totalViews: number;
  pendingComments: number;
}

export interface ArticleStats {
  published: number;
  draft: number;
  total: number;
  topViewed: Array<{
    id: number;
    title: string;
    viewCount: number;
    createdAt: string;
    _count: {
      comments: number;
    };
  }>;
}

export interface MonthlyStats {
  year: number;
  data: Array<{
    month: number;
    articles: number;
    comments: number;
    views: number;
  }>;
}

export interface TagStats {
  id: number;
  name: string;
  color?: string;
  articleCount: number;
}

export interface Activity {
  id: number;
  type: 'article' | 'comment' | 'project';
  title?: string;
  author?: string;
  content?: string;
  createdAt: string;
  article?: {
    id: number;
    title: string;
  };
}