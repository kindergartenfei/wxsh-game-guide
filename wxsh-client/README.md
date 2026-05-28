# wxsh-client — 妄想山海宠物变异属性检索

基于 [wxsh.me](https://wxsh.me/) 的 Vue 3 前端站点，支持属性检索、拼音搜索与日间/夜间主题切换。

## 运行

```bash
cd wxsh-client
npm install
npm run dev        # 开发模式，端口 5173
```

构建生产版本：

```bash
npm run build
npm run preview
```

## 功能

- 属性检索：按部位、年份、档位筛选
- 拼音 / 首字母搜索
- 日间 / 夜间主题切换
- 后端不可用时自动回退到本地静态数据

## 代理配置

开发模式下 `/api` 请求代理到 `http://localhost:3000`（后端 wxsh-admin）。如需修改，编辑 `vite.config.js`。
