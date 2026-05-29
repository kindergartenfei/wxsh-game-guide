# 妄想山海宠物变异攻略 — 部署文档

## 项目结构

| 目录 | 说明 | 技术栈 | 端口 |
|------|------|--------|------|
| `wxsh-api/` | 后端 API 服务 | Node.js + Express + MySQL | 3000 |
| `wxsh-admin/` | 数据管理后台 | Vue 3 + Vite | 5174(开发) |
| `wxsh-client/` | 公开检索站点 | Vue 3 + Vite | 5173(开发) |

---

## 一、环境要求

- **Node.js** 18 及以上
- **MySQL** 5.7 / 8.0
- **宝塔面板**（推荐）

---

## 二、宝塔面板部署步骤

### 步骤 1：上传项目

将整个项目目录上传到服务器，例如 `/www/wwwroot/wxsh/`。

宝塔面板 → 文件 → 上传压缩包后解压，或使用 Git 克隆：

```bash
cd /www/wwwroot
git clone <仓库地址> wxsh
```

---

### 步骤 2：创建数据库

1. 宝塔面板 → 数据库 → 添加数据库
   - 数据库名：`wxsh`
   - 用户名：`wxsh`（或自定义）
   - 密码：设置一个强密码
   - 字符集：`utf8mb4`

2. 导入数据：点击「导入」→ 上传 `wxsh-api/sql/install.sql` → 执行
   - 该文件包含建表语句 + 60+ 条演示数据

---

### 步骤 3：部署后端 API（wxsh-api）

```bash
# 进入 API 目录
cd /www/wwwroot/wxsh/wxsh-api

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env
```

编辑 `.env`，填入步骤 2 创建的数据库信息：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=wxsh
DB_PASSWORD=你的数据库密码
DB_NAME=wxsh
```

先手动测试启动：

```bash
node src/server.js
```

看到输出 `[Server] http://localhost:3000` 即启动成功，`Ctrl+C` 停止。

#### 使用 PM2 守护进程

```bash
# 安装 PM2
npm install -g pm2

# 启动 API 服务
cd /www/wwwroot/wxsh/wxsh-api
pm2 start src/server.js --name wxsh-api

# 查看运行状态
pm2 status

# 设置开机自启
pm2 save
pm2 startup
```

管理命令：

```bash
pm2 restart wxsh-api   # 重启
pm2 stop wxsh-api      # 停止
pm2 logs wxsh-api      # 查看日志
```

---

### 步骤 4：部署管理后台（wxsh-admin）

```bash
cd /www/wwwroot/wxsh/wxsh-admin
npm install
npm run build        # 生成 dist/ 目录
```

构建完成后，`dist/` 目录即为静态站点文件。

**宝塔面板操作：**

1. 网站 → 添加站点 → 填写管理后台域名（如 `admin.your-domain.com`）
2. 站点目录指向：`/www/wwwroot/wxsh/wxsh-admin/dist`
3. 保存后进入站点设置 → 配置文件，替换为以下 Nginx 配置：

```nginx
server {
    listen 80;
    server_name admin.your-domain.com;   # 改为你的域名

    root /www/wwwroot/wxsh/wxsh-admin/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Vue 路由 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 步骤 5：部署前端检索站点（wxsh-client）

```bash
cd /www/wwwroot/wxsh/wxsh-client
npm install
npm run build        # 生成 dist/ 目录
```

**宝塔面板操作：**

1. 网站 → 添加站点 → 填写前台域名（如 `wxsh.your-domain.com` 或 `www.your-domain.com`）
2. 站点目录指向：`/www/wwwroot/wxsh/wxsh-client/dist`
3. 进入站点设置 → 配置文件，替换为以下 Nginx 配置：

```nginx
server {
    listen 80;
    server_name wxsh.your-domain.com;    # 改为你的域名

    root /www/wwwroot/wxsh/wxsh-client/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Vue 路由 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 步骤 6：配置 SSL 证书（可选但推荐）

宝塔面板 → 网站 → 对应站点 → SSL → 申请 Let's Encrypt 证书，一键开启 HTTPS。

开启后勾选「强制 HTTPS」即可。

---

### 步骤 7：验证部署

- **API 健康检查**：访问 `http://你的域名/api/health`，返回 JSON 则正常
- **管理后台**：访问管理后台域名，应能看到数据管理页面
- **前端站点**：访问前台域名，应能看到宠物检索页面

---

## 三、本地开发

```bash
# 1. 启动后端 API
cd wxsh-api
cp .env.example .env    # 编辑 .env 配置本地数据库
npm install
npm run dev              # 端口 3000，支持热重载

# 2. 启动管理后台（新终端）
cd wxsh-admin
npm install
npm run dev              # 端口 5174，自动代理 /api -> localhost:3000

# 3. 启动前端站点（新终端）
cd wxsh-client
npm install
npm run dev              # 端口 5173，自动代理 /api -> localhost:3000
```

本地方问地址：
- API: `http://localhost:3000/api/health`
- 管理后台: `http://localhost:5174`
- 前端站点: `http://localhost:5173`

---

## 四、项目运行方法总结

### wxsh-api（后端接口）

```bash
cd wxsh-api
npm install              # 安装依赖
cp .env.example .env     # 配置数据库连接
npm run dev              # 开发模式（热重载）
npm start                # 生产模式
```

### wxsh-admin（管理后台）

```bash
cd wxsh-admin
npm install              # 安装依赖
npm run dev              # 开发模式（热重载，端口 5174）
npm run build            # 构建生产版本到 dist/
npm run preview          # 预览构建结果
```

### wxsh-client（前端站点）

```bash
cd wxsh-client
npm install              # 安装依赖
npm run dev              # 开发模式（热重载，端口 5173）
npm run build            # 构建生产版本到 dist/
npm run preview          # 预览构建结果
```

---

## 五、常见问题

### Q: 启动报错 ECONNREFUSED 或 ER_ACCESS_DENIED
- 确认 MySQL 服务已启动
- 检查 `.env` 中数据库用户名、密码是否正确
- 宝塔面板中确认数据库权限为「所有人」或 `127.0.0.1`

### Q: 管理后台/前端页面空白
- 确认已执行 `npm run build`，`dist/` 目录存在
- 浏览器 F12 查看控制台是否有 404 错误
- Nginx 配置中站点目录路径是否正确

### Q: 前端展示无数据
- 确认后端 `/api/health` 正常返回
- 确认数据库 `pet_mutate` 表有数据
- 确认 Nginx 反向代理配置了 `/api/` → `http://127.0.0.1:3000`

### Q: PM2 相关
```bash
pm2 list               # 查看所有进程
pm2 restart wxsh-api   # 重启
pm2 logs wxsh-api      # 查看日志
pm2 delete wxsh-api    # 删除进程
```

### Q: 端口被占用
```bash
lsof -i :3000          # 查看占用 3000 端口的进程
kill -9 <PID>          # 结束进程
```
