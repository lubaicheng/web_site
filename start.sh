#!/bin/bash

echo "=========================================="
echo "  课题组网站 — 一键启动"
echo "=========================================="

if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# 创建 .env
if [ ! -f .env ]; then
    echo 'DATABASE_URL="file:./dev.db"' > .env
fi

# 安装依赖 + 自动生成 prisma client（postinstall 钩子）
if [ ! -d node_modules ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 确保 Prisma Client 已生成（如果 src/generated/prisma 不存在）
if [ ! -f src/generated/prisma/client.ts ]; then
    echo "🔧 生成 Prisma Client..."
    npx prisma generate
fi

# 初始化数据库（如果 dev.db 不存在）
if [ ! -f dev.db ]; then
    echo "🗄️  初始化数据库..."
    npx prisma db push
    npx prisma db seed
fi

echo ""
echo "🌐 浏览器打开: http://localhost:3000"
echo "🔐 后台: http://localhost:3000/admin"
echo "   账号: admin / admin123"
echo "   按 Ctrl+C 停止"
echo ""

# 自动打开浏览器
if command -v open &> /dev/null; then
    open http://localhost:3000
fi

npm run dev
