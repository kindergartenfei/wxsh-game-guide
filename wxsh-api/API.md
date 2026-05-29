# wxsh-api 接口文档

## 基础信息

- **基础路径**: `http://localhost:3000/api`
- **响应格式**: 统一 JSON

```json
{
  "code": 0,          // 0=成功, 非0=失败
  "message": "success",
  "data": {}
}
```

---

## 接口列表

### 1. 健康检查

**GET** `/api/health`

测试数据库连接是否正常。

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": "ok",
    "time": "2026-05-29T12:00:00.000Z"
  }
}
```

---

### 2. 元数据

**GET** `/api/pets/meta`

返回部位列表、年份映射等元数据。

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "parts": ["角", "头", "翅膀", "背部", "尾巴", "脖子", "手臂"],
    "defaultParts": ["角", "头", "翅膀", "背部", "尾巴", "脖子", "手臂"],
    "years": [
      { "value": 1, "label": "百年", "count": 10 }
    ],
    "yearMap": { "1": "百年", "2": "千年" },
    "yearLabelToValue": { "百年": 1, "千年": 2 }
  }
}
```

---

### 3. 统计信息

**GET** `/api/pets/stats`

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "summary": {
      "total": 66,
      "pet_types": 45,
      "part_types": 7,
      "max_attack": 1278,
      "min_attack": 295
    },
    "byPart": [
      { "mutate_part": "尾巴", "count": 12 }
    ],
    "byYear": [
      { "pet_year": 1, "count": 10, "label": "百年" }
    ]
  }
}
```

---

### 4. 宠物列表（分页+筛选）

**GET** `/api/pets`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 20，最大 100 |
| keyword | string | 否 | 模糊搜索（宠物名/部位） |
| pet_name | string | 否 | 宠物名精确搜索 |
| mutate_part | string | 否 | 变异部位筛选 |
| pet_year | int | 否 | 年份筛选（1-5） |
| tier | string | 否 | 档位筛选（T1/T2/T3） |
| min_attack | int | 否 | 最小攻击值 |
| max_attack | int | 否 | 最大攻击值 |
| sortBy | string | 否 | 排序字段，默认 attack_value |
| sortOrder | string | 否 | asc/desc，默认 desc |

**请求示例**:
```
GET /api/pets?page=1&pageSize=10&mutate_part=尾巴&tier=T2&sortBy=attack_value&sortOrder=desc
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "pet_name": "穷奇",
        "mutate_part": "尾巴",
        "attack_value": 579,
        "penetrate_value": 0,
        "pet_year": 2,
        "tier": "T2",
        "pet_year_label": "千年"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 5. 宠物详情

**GET** `/api/pets/:id`

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "pet_name": "穷奇",
    "mutate_part": "尾巴",
    "attack_value": 579,
    "penetrate_value": 0,
    "pet_year": 2,
    "tier": "T2",
    "pet_year_label": "千年"
  }
}
```

---

### 6. 新增宠物

**POST** `/api/pets`

**请求体** (JSON):
```json
{
  "pet_name": "穷奇",
  "mutate_part": "尾巴",
  "attack_value": 579,
  "penetrate_value": 0,
  "pet_year": 2,
  "tier": "T2"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pet_name | string | 是 | 宠物名，最长 50 字符 |
| mutate_part | string | 是 | 变异部位，最长 30 字符 |
| attack_value | int | 是 | 攻击值，非负整数 |
| penetrate_value | int | 是 | 穿透值，非负整数 |
| pet_year | int | 是 | 年份：1=百年, 2=千年, 3=万年, 4=三/四万年, 5=五~八万年 |
| tier | string | 否 | 档位：T1/T2/T3，默认 T1 |

**成功响应**:
```json
{
  "code": 0,
  "message": "创建成功",
  "data": { "id": 67, "pet_name": "穷奇", "..." : "..." }
}
```

---

### 7. 更新宠物

**PUT** `/api/pets/:id`

请求体格式同新增，所有字段可选（仅更新传入的字段）。

**成功响应**:
```json
{
  "code": 0,
  "message": "更新成功",
  "data": { "id": 1, "pet_name": "穷奇·改", "..." : "..." }
}
```

---

### 8. 删除宠物

**DELETE** `/api/pets/:id`

**成功响应**:
```json
{
  "code": 0,
  "message": "删除成功",
  "data": null
}
```

---

### 9. 批量删除

**POST** `/api/pets/batch-delete`

**请求体**:
```json
{
  "ids": [1, 2, 3]
}
```

**成功响应**:
```json
{
  "code": 0,
  "message": "已删除 3 条",
  "data": { "deleted": 3 }
}
```

---

### 10. 攻击档位分组

**GET** `/api/pets/attack-groups`

按部位+年份+档位+攻击值+穿透值聚合分组，用于属性档位查询。

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "mutate_part": "尾巴",
      "pet_year": 5,
      "tier": "T3",
      "attack_value": 1278,
      "penetrate_value": 58,
      "pet_count": 1,
      "pet_year_label": "五/六/七/八万年",
      "pets": ["绵寿·九尾狐"]
    }
  ]
}
```

---

### 11. 前端卡片数据

**GET** `/api/pets/cards`

用于前端属性检索页面的卡片展示，返回聚合后的卡片数据。

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "part": "尾巴",
      "year": "五/六/七/八万年",
      "pet_year": 5,
      "tier": "T3",
      "attack": 1278,
      "penetrate": 58,
      "bio": "绵寿·九尾狐",
      "pets": ["绵寿·九尾狐"],
      "pet_count": 1
    }
  ]
}
```

---

## 错误码

| HTTP 状态码 | code | 说明 |
|-------------|------|------|
| 400 | 1 | 参数校验失败 |
| 400 | 400 | 数据重复 |
| 404 | 404 | 记录/接口不存在 |
| 500 | 500 | 服务器内部错误 |
| 503 | 503 | 数据库不可用 |

**错误响应示例**:
```json
{
  "code": 404,
  "message": "记录不存在",
  "data": null
}
```
