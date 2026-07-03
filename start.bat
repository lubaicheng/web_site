@echo off
chcp 65001 >nul

echo ==========================================
echo   课题组网站 — 一键启动
echo ==========================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 请先安装 Node.js: https://nodejs.org
    pause
    exit /b
)
echo ✅ Node.js

if not exist .env (
    echo DATABASE_URL="file:./dev.db" > .env
)

if not exist node_modules (
    echo 正在安装依赖...
    call npm install
)

if not exist src\generated\prisma\client.ts (
    echo 正在生成 Prisma Client...
    call npx prisma generate
)

if not exist dev.db (
    echo 正在初始化数据库...
    call npx prisma db push
    call npx prisma db seed
)

echo.
echo 前台: http://localhost:3000
echo 后台: http://localhost:3000/admin
echo 账号: admin / admin123
echo.

start http://localhost:3000
call npm run dev
pause
