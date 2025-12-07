# KBlog Backend 博客系统

一个基于 NestJS + React 的现代化博客系统，采用 monorepo 架构，前后端分离设计。

## 🚀 技术栈

### 后端 (API)

- **框架**: NestJS
- **数据库**: MySQL
- **ORM**: Prisma
- **缓存**: Redis
- **认证**: JWT + Passport
- **文档**: Swagger
- **语言**: TypeScript

### 前端 (Admin)

- **框架**: React 18
- **语言**: TypeScript
- **UI 库**: Ant Design
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **路由**: React Router
- **查询**: React Query
- **图表**: Recharts
- **编辑器**: React MD Editor

## 📁 项目结构

```
kblog-backend/
├── api/                    # 后端 API 服务
│   ├── src/
│   │   ├── modules/       # 业务模块
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── articles/  # 文章模块
│   │   │   ├── tags/      # 标签模块
│   │   │   ├── comments/  # 评论模块
│   │   │   ├── projects/  # 项目模块
│   │   │   ├── profile/   # 个人信息模块
│   │   │   └── stats/     # 统计模块
│   │   ├── common/        # 公共模块
│   │   │   ├── prisma/    # 数据库服务
│   │   │   └── decorators/ # 装饰器
│   │   ├── main.ts        # 应用入口
│   │   └── app.module.ts  # 根模块
│   ├── prisma/
│   │   └── schema.prisma  # 数据库模型
│   └── .env               # 环境变量
├── admin/                 # 前端管理后台
│   ├── src/
│   │   ├── components/    # 组件
│   │   │   └── Layout/    # 布局组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API 服务
│   │   ├── store/         # 状态管理
│   │   ├── types/         # 类型定义
│   │   ├── App.tsx        # 根组件
│   │   └── index.tsx      # 入口文件
│   └── package.json
├── package.json           # 根配置文件
└── README.md             # 项目说明
```

## 🛠️ 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm 或 yarn

## 📋 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd kblog-backend
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装 API 项目依赖
cd api && npm install

# 安装 Admin 项目依赖
cd ../admin && npm install
```

### 3. 环境配置

#### API 环境变量配置

在 `api/.env` 文件中配置：

```env
# 数据库配置
DATABASE_URL="mysql://king:4869@localhost:3306/kblog?serverTimezone=UTC"

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 应用配置
PORT=3000
NODE_ENV=development
```

### 4. 数据库设置

#### 4.1 创建数据库

```sql
CREATE DATABASE kblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 4.2 生成 Prisma 客户端

```bash
cd api
npx prisma generate
```

#### 4.3 运行数据库迁移

```bash
cd api
npx prisma migrate dev --name init
```

#### 4.4 可选：查看数据库

```bash
cd api
npx prisma studio
```

### 5. 启动服务

#### 启动后端 API 服务

```bash
cd api
npm run start:dev
```

API 服务将在 http://localhost:3000 启动

#### 启动前端管理后台

```bash
cd admin
npm start
```

管理后台将在 http://localhost:3001 启动

#### 同时启动前后端

```bash
# 在根目录执行
npm run dev
```

## 📖 API 文档

启动 API 服务后，可以通过以下地址访问 Swagger 文档：

- API 文档: http://localhost:3000/api-docs

## 🔧 主要功能

### 认证系统

- 用户注册和登录
- JWT 认证
- 权限控制

### 文章管理

- 文章的增删改查
- 草稿功能
- 文章发布/取消发布
- 标签关联
- 阅读数统计

### 标签管理

- 标签的增删改查
- 标签颜色设置
- 文章标签关联

### 评论系统

- 评论的增删改查
- 评论审核（通过/拒绝）
- 游客评论功能

### 项目管理

- 作品展示
- 项目链接管理
- 推荐项目设置

### 个人信息管理

- 个人资料设置
- 社交链接管理

### 统计功能

- 数据总览统计
- 月度趋势图表
- 热门文章统计
- 最近活动记录

## 🎯 开发计划

- [ ] 完善 Admin 管理页面
- [ ] 添加 Markdown 编辑器集成
- [ ] 实现图片上传功能
- [ ] 添加邮件通知功能
- [ ] 实现全文搜索
- [ ] 添加系统日志记录
- [ ] 实现数据备份功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
