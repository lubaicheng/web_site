# 课题组网站项目 — 快速参考

## 启动
```bash
cd /Users/wanglingyu/Desktop/LAB_Website_deepseek
npm run dev    # 开发 → http://localhost:3000
npm run build && npm start  # 生产
```

## 后台登录
http://localhost:3000/admin  →  admin / admin123

## 数据库
SQLite 文件: `/Users/wanglingyu/Desktop/LAB_Website_deepseek/dev.db`
Prisma: 7.x + libSQL adapter
```bash
npm exec prisma studio          # 可视化查看
npm exec prisma db seed         # 重置种子数据
npm exec prisma migrate dev     # 改 schema 后迁移
```

## 核心架构
```
前台 /[locale]/     → EN/ZH 双语，Header 从 SiteConfig 读名
后台 /admin/        → 全中文 CRUD，8 个模块
API /api/*          → RESTful CRUD，upload 保存到 public/uploads/
```

## 8 个数据模型
News / TeamMember (+ MemberSection 子模块) / Publication / ResearchArea
CarouselImage / FriendlyLink / SiteConfig（单行全站配置）

## 最近改了什么
1. 站点配置: 网站名/Logo、新闻 3+7 数量、轮播间隔 → 后台可配
2. 中文页面显示中文网站名（Header 以前只显示英文）
3. 图片上传组件 ImageUploader（统一尺寸建议+预览+上传）
4. 研究方向: 左侧编号+切换，右侧只显示选中项，描述用富文本
5. 人员详情: 子模块动态渲染，支持富文本
6. 参考 zhou.nankai.edu.cn 改了 RESEARCH 页
7. 参考 irongroup.sjtu.edu.cn 改了 TEAMS 页（卡片+详情）


