# wxsh-admin — 后端 API 与管理后台

Node.js + Express + MySQL，为妄想山海宠物变异攻略提供数据接口与可视化管理。

## 目录结构

```
wxsh-admin/
├── admin/                # 管理后台前端（Vue 3，构建后输出到 public/admin）
├── public/               # 静态文件（构建产物）
├── sql/
│   ├── schema.sql        # 建表语句
│   └── seed.sql          # 示例数据
├── scripts/
│   ├── import-archive.mjs  # 从 wxsh-client 静态数据导入 MySQL
│   └── seed-test.mjs       # 生成测试数据
├── src/
│   ├── config/           # 配置与枚举
│   ├── db/               # mysql2 连接池
│   ├── controllers/      # 控制器
│   ├── services/         # 业务与 SQL
│   ├── routes/           # 路由
│   ├── middleware/       # 错误处理
│   ├── validators/       # 参数校验
│   ├── utils/            # 工具函数
│   ├── app.js            # Express 应用配置
│   └── server.js         # 入口
├── .env                  # 环境变量
├── .env.example          # 环境变量模板
└── package.json
```

## 环境要求

- Node.js 18+
- MySQL 5.7+ / 8.0

## 快速开始

### 1. 数据库

在 MySQL 中创建数据库和表：

```bash
mysql -uroot -p < sql/schema.sql
```

或者用宝塔面板导入 `sql/install.sql`（包含建库 + 建表 + 演示数据）。

### 2. 配置

编辑 `.env`：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=wxsh
```

### 3. 安装与启动

```bash
cd wxsh-admin
npm install
npm run dev        # 开发模式，支持热重载
```

生产模式：

```bash
npm start
```

### 4. 构建管理后台

```bash
npm run admin:install   # 首次需安装 admin 依赖
npm run build           # 构建管理后台到 public/admin
```

## API 接口

### 统一返回格式

```json
{ "code": 0, "message": "success", "data": {} }
```

| code | 说明 |
|------|------|
| 0 | 成功 |
| 非 0 | 业务或参数错误 |

### 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/pets` | 分页列表 + 筛选 |
| GET | `/api/pets/meta` | 部位/年份元数据 |
| GET | `/api/pets/stats` | 统计概览 |
| GET | `/api/pets/cards` | 属性卡片（前端检索用） |
| GET | `/api/pets/attack-groups` | 攻击档位聚合 |
| GET | `/api/pets/:id` | 单条详情 |
| POST | `/api/pets` | 新增 |
| PUT | `/api/pets/:id` | 更新 |
| DELETE | `/api/pets/:id` | 删除 |
| POST | `/api/pets/batch-delete` | 批量删除 |

### GET /api/pets 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 20，最大 100 |
| keyword | string | 宠物名或部位模糊搜索 |
| pet_name | string | 宠物名模糊 |
| mutate_part | string | 部位精确匹配 |
| pet_year | number | 年份 1~5 |
| tier | string | 档位 T1/T2/T3 |
| min_attack | number | 最低攻击 |
| max_attack | number | 最高攻击 |
| sortBy | string | attack_value / penetrate_value / pet_year / id |
| sortOrder | string | asc / desc |

## 年份枚举

| 值 | 含义 |
|----|------|
| 1 | 百年 |
| 2 | 千年 |
| 3 | 万年 |
| 4 | 三/四万年 |
| 5 | 五/六/七/八万年 |

## 访问地址

- 后端 API：http://localhost:3000/api
- 管理后台：http://localhost:3000/admin
- 前端站点：http://localhost:5173（wxsh-client 开发模式）
