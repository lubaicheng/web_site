@echo off
chcp 65001 >nul

echo ==========================================
echo   课题组网站 — 一键启动
echo ==========================================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 本机未安装 Node.js
    echo 下载地址: https://nodejs.org
    echo 下载后安装（一路下一步即可），然后重新双击本文件
    start https://nodejs.org
    pause
    exit /b
)
echo ✅ Node.js 已安装

REM 检查是否在项目目录
if not exist package.json (
    echo ❌ 请把本文件放在项目根目录（与 package.json 同目录）
    pause
    exit /b
)

REM 第一次启动：装依赖 + 建数据库
if not exist node_modules (
    echo 📦 正在安装依赖（首次约1-2分钟）...
    call npm install --silent
)

if not exist dev.db (
    echo DATABASE_URL="file:./dev.db" > .env
    echo 🗄️  正在初始化数据库...
    call npx prisma db push >nul 2>&1
    call npx prisma generate >nul 2>&1
    call npx prisma db seed >nul 2>&1
)

echo.
echo 🌐 正在启动...
echo.
echo   前台: http://localhost:3000
echo   后台: http://localhost:3000/admin
echo   账号: admin / admin123
echo.
echo   请勿关闭本窗口，启动后自动打开浏览器
echo   按 Ctrl+C 停止服务
echo.

start http://localhost:3000
call npm run dev
pause
