#!/bin/bash

echo "🔍 验证 Docker 配置..."

# 检查必要的文件
required_files=(
    "api/Dockerfile"
    "admin/Dockerfile"
    "docker-compose.yml"
    "api/.env.example"
    "deploy.sh"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 缺失"
        missing_files=$((missing_files + 1))
    fi
done

# 检查可选文件
optional_files=(
    ".dockerignore"
    "api/.dockerignore"
    "admin/.dockerignore"
    "nginx.conf"
    "init.sql"
)

echo ""
echo "📁 可选文件检查："
for file in "${optional_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "⚠️  $file 缺失（可选）"
    fi
done

# 检查 Docker 和 Docker Compose
echo ""
echo "🐳 检查 Docker 环境："
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装"
    docker_version=$(docker --version)
    echo "   版本: $docker_version"
else
    echo "❌ Docker 未安装"
fi

if docker compose version &> /dev/null; then
    echo "✅ Docker Compose Plugin 已安装"
    compose_version=$(docker compose version --short)
    echo "   版本: $compose_version"
elif command -v docker-compose &> /dev/null; then
    echo "✅ 独立 Docker Compose 已安装"
    compose_version=$(docker-compose --version)
    echo "   版本: $compose_version"
else
    echo "❌ Docker Compose 不可用"
fi

# 总结
echo ""
echo "📊 验证结果："
if [ $missing_files -eq 0 ]; then
    echo "✅ 所有必需文件都已创建！"
    echo ""
    echo "🚀 可以开始部署："
    echo "   1. 复制环境变量: cp api/.env.example api/.env"
    echo "   2. 编辑 api/.env 文件，配置数据库和 JWT 密钥"
    echo "   3. 运行部署脚本: ./deploy.sh"
    echo "   或手动部署: docker-compose up -d"
else
    echo "⚠️  有 $missing_files 个必需文件缺失"
    echo "   请检查并创建缺失的文件"
fi

echo ""
echo "📖 更多信息请查看 README.md 文件"
