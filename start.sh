#!/bin/bash

# 课题组网站 — 一键启动脚本 (Mac / Linux)

echo "=========================================="
echo "  课题组网站 — 本地启动"
echo "=========================================="

if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装：https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# 创建 .env
if [ ! -f .env ]; then
    echo 'DATABASE_URL="file:./dev.db"' > .env
    echo "📄 已创建 .env"
fi

# 安装依赖
if [ ! -d node_modules ]; then
    echo "📦 安装依赖..."
    npm install --silent
fi

# 初始化数据库
if [ ! -f dev.db ]; then
    echo "🗄️  初始化数据库..."
    npx prisma db push 2>/dev/null
    npx prisma generate 2>/dev/null
    npx prisma db seed 2>/dev/null
    echo "✅ 数据库已就绪"
fi

echo ""
echo "🌐 http://localhost:3000"
echo "🔐 后台: http://localhost:3000/admin  admin/admin123"
echo "   按 Ctrl+C 停止"
echo ""

npm run dev
