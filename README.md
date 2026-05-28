# 妄想山海宠物变异攻略

游戏《妄想山海》宠物变异属性检索工具，包含公开检索站点、后端 API 与管理后台。

## 项目结构

```
├── wxsh-admin/         # 后端 API（Express + MySQL）+ 管理后台（Vue 3）
│   ├── admin/          #   管理后台前端源码
│   ├── src/            #   API 源码
│   ├── sql/            #   数据库脚本
│   └── public/         #   构建产物（管理后台 + 静态文件）
├── wxsh-client/        # 前端公开检索站点（Vue 3）
│   └── src/            #   前端源码
├── DEPLOY.md           # 运行部署文档
└── README.md
```

## 快速开始

```bash
# 1. 启动后端
cd wxsh-admin
npm install
cp .env.example .env   # 编辑数据库配置
npm run dev

# 2. 启动前端
cd ../wxsh-client
npm install
npm run dev
```

- 前端页面：http://localhost:5173
- 管理后台：http://localhost:3000/admin
- API 接口：http://localhost:3000/api

## 部署

详细部署步骤请参阅 [DEPLOY.md](./DEPLOY.md)。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Node.js / Express / mysql2 |
| 管理后台 | Vue 3 / Vite |
| 前端站点 | Vue 3 / Vite / pinyin-pro |
| 数据库 | MySQL |
