# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 使用 Nginx 作为生产服务器
FROM nginx:alpine

# 复制构建的静态文件到 Nginx 目录
COPY --from=builder /app/build /usr/share/nginx/html

# 复制自定义 Nginx 配置（如果需要）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
