import dotenv from 'dotenv'

dotenv.config()

/** pet_year 枚举：与前端年份筛选对应 */
export const YEAR_MAP = {
  1: '百年',
  2: '千年',
  3: '万年',
  4: '三/四万年',
  5: '五/六/七/八万年',
}

export const YEAR_LABEL_TO_VALUE = Object.fromEntries(
  Object.entries(YEAR_MAP).map(([k, v]) => [v, Number(k)]),
)

export const PARTS = ['角', '头', '翅膀', '背部', '尾巴', '脖子', '手臂']

export const config = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wxsh',
  },
}
