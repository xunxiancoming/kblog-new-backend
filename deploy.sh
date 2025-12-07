#!/bin/bash

# KBlog 博客系统 Docker 部署脚本

set -e

echo "🚀 开始部署 KBlog 博客系统..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否可用
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo "✅ 使用 Docker Compose Plugin"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo "✅ 使用独立 Docker Compose"
else
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建环境变量文件（如果不存在）
if [ ! -f "api/.env" ]; then
    echo "📝 创建环境变量文件..."
    cp api/.env.example api/.env
    echo "⚠️  请编辑 api/.env 文件，配置数据库连接和 JWT 密钥"
    read -p "按 Enter 键继续（或 Ctrl+C 取消）..."
fi

# 构建并启动服务
echo "🔨 构建 Docker 镜像..."
$DOCKER_COMPOSE_CMD build

echo "🚀 启动服务..."
$DOCKER_COMPOSE_CMD up -d

echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "📊 服务状态："
$DOCKER_COMPOSE_CMD ps

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "  前端管理后台: http://localhost:80"
echo "  后端 API 服务: http://localhost:3003"
echo "  API 文档: http://localhost:3003/api-docs"
echo ""
echo "🔧 常用命令："
echo "  查看日志: $DOCKER_COMPOSE_CMD logs -f"
echo "  停止服务: $DOCKER_COMPOSE_CMD down"
echo "  重启服务: $DOCKER_COMPOSE_CMD restart"
echo "  查看状态: $DOCKER_COMPOSE_CMD ps"
echo ""
echo "📝 数据库信息："
echo "  MySQL: localhost:3306 (用户: kblog_user, 密码: kblog_password)"
echo "  Redis: localhost:6379"
