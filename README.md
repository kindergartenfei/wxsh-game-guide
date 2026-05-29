# 妄想山海宠物变异攻略

游戏《妄想山海》宠物变异属性检索工具，包含公开检索站点、后端 API 与管理后台。

## 项目结构

```
├── wxsh-api/            # 后端 API 服务（Express + MySQL）
│   ├── src/             #   API 源码
│   ├── sql/             #   数据库脚本
│   └── scripts/         #   数据导入脚本
├── wxsh-admin/          # 数据管理后台（Vue 3）
│   └── src/             #   管理后台源码
├── wxsh-client/         # 前端公开检索站点（Vue 3）
│   └── src/             #   前端源码
├── DEPLOY.md            # 部署文档（含宝塔面板教程）
├── wxsh-api/API.md      # 接口文档
└── README.md
```

## 快速开始

```bash
# 1. 启动后端 API
cd wxsh-api
npm install
cp .env.example .env   # 编辑数据库配置
npm run dev             # http://localhost:3000

# 2. 启动前端站点（新终端）
cd wxsh-client
npm install
npm run dev             # http://localhost:5173

# 3. 启动管理后台（新终端）
cd wxsh-admin
npm install
npm run dev             # http://localhost:5174
```

- API 接口：http://localhost:3000/api
- 前端站点：http://localhost:5173
- 管理后台：http://localhost:5174

## 部署

详细部署步骤请参阅 [DEPLOY.md](./DEPLOY.md)，包含宝塔面板完整部署教程。

## 接口文档

API 接口文档请参阅 [wxsh-api/API.md](./wxsh-api/API.md)。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Node.js / Express / mysql2 |
| 管理后台 | Vue 3 / Vite |
| 前端站点 | Vue 3 / Vite / pinyin-pro |
| 数据库 | MySQL |
