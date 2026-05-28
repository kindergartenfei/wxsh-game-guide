# 妄想山海宠物变异攻略 — 运行部署文档

## 项目简介

本项目包含两个子项目：

| 目录 | 说明 | 技术栈 | 端口 |
|------|------|--------|------|
| `wxsh-admin/` | 后端 API + 管理后台 | Node.js + Express + MySQL + Vue 3 | 3000 |
| `wxsh-client/` | 前端公开检索站点 | Vue 3 + Vite | 5173(开发) |

---

## 一、环境要求

- **Node.js** 18 及以上
- **MySQL** 5.7 或 8.0
- **npm** 9 及以上
- （可选）宝塔面板（用于可视化管理数据库）

---

## 二、宝塔面板部署步骤

### 1. 导入数据库

1. 登录宝塔面板 → 数据库 → 添加数据库
   - 数据库名：`wxsh`
   - 用户名：`wxsh_admin`
   - 密码：`wxsh2024@Demo`（或自行设置）
   - 字符集：`utf8mb4`

2. 点击「导入」→ 上传 `wxsh-admin/sql/install.sql`
   - 该文件包含建表语句 + 60+ 条演示数据
   - 勾选「遇到错误继续」，点击执行

3. 导入成功后刷新，应看到 `pet_mutate` 表及数据

### 2. 部署后端

```bash
# 1. 将项目上传到服务器（如 /www/wwwroot/wxsh）
cd /www/wwwroot/wxsh

# 2. 安装后端依赖
cd wxsh-admin
npm install

# 3. 配置数据库连接
cp .env.example .env
nano .env
```

修改 `.env` 为你的实际数据库信息：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=wxsh_admin
DB_PASSWORD=wxsh2024@Demo
DB_NAME=wxsh
```

```bash
# 4. 安装管理后台前端依赖
npm run admin:install

# 5. 构建管理后台
npm run build

# 6. 启动服务（先测试）
npm start
```

访问 `http://121.196.196.21:3000/api/health`，返回 JSON 则后端启动成功。
访问 `http://121.196.196.21:3000/admin` 可打开管理后台。

### 3. 使用 PM2 守护后端进程

```bash
# 安装 PM2
npm install -g pm2

# 启动
cd /www/wwwroot/wxsh/wxsh-admin
pm2 start src/server.js --name wxsh-admin

# 设置开机自启
pm2 save
pm2 startup
```

### 4. 部署前端站点（两种方式）

**方式 A：构建静态文件并用 Nginx 托管（推荐）**

```bash
cd /www/wwwroot/wxsh/wxsh-client
npm install
npm run build
```

`dist/` 目录即为静态站点的文件。在宝塔面板中：
1. 网站 → 添加站点 → 填写域名
2. 站点目录指向 `wxsh-client/dist/`
3. 添加反向代理：`/api` → `http://127.0.0.1:3000`

Nginx 配置参考：

```nginx
server {
    listen 80;
    server_name 你的域名;

    root /www/wwwroot/wxsh/wxsh-client/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Vue 路由 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**方式 B：直接用 Vite 开发模式（仅开发测试用）**

```bash
cd /www/wwwroot/wxsh/wxsh-client
npm install
nohup npm run dev &
```

### 5. 绑定域名

1. 宝塔面板 → 网站 → 对应站点 → 域名管理
2. 添加你的域名
3. 如有需要，配置 SSL 证书（宝塔面板可一键申请 Let's Encrypt）

---

## 三、本地开发

```bash
# 1. 克隆项目
git clone <你的仓库地址>
cd wxsh-game

# 2. 启动后端
cd wxsh-admin
cp .env.example .env    # 编辑 .env 配置数据库
npm install
npm run dev              # 端口 3000，支持热重载

# 3. 启动前端（新终端）
cd ../wxsh-client
npm install
npm run dev              # 端口 5173

# 4. 启动管理后台开发模式（可选）
cd ../wxsh-admin/admin
npm install
npm run dev              # 端口 5174
```

---

## 四、常见问题

### Q: 启动报错 ECONNREFUSED 或 ER_ACCESS_DENIED
- 确认 MySQL 服务已启动
- 检查 `.env` 中的数据库用户名和密码是否正确
- 宝塔面板中确认数据库权限为「所有人」或指定 IP

### Q: 管理后台页面空白
- 确认已执行 `npm run build`，`public/admin/` 目录存在
- 浏览器 F12 查看控制台是否有 404 错误

### Q: 前端页面展示无数据
- 确认后端 `/api/health` 能正常返回
- 确认数据库中 `pet_mutate` 表有数据
- 如果后端不可用，前端会自动使用本地静态数据兜底

### Q: PM2 启动后端口被占用
```bash
pm2 list              # 查看运行中的进程
pm2 stop wxsh-admin   # 停止旧的
pm2 start wxsh-admin  # 重新启动
```
