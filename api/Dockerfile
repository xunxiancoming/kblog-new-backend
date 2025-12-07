# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:20-alpine

# 安装必要的工具
RUN apk add --no-cache openssl

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 复制 prisma 目录
COPY --from=builder /app/prisma ./prisma/

# 安装生产依赖
RUN npm ci --only=production

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3003

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3003

# 运行数据库迁移并启动应用
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
