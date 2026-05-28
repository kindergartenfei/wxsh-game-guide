/**
 * 插入测试假数据：每个年份 × 每个部位均有记录，含 T1/T2/T3
 * 用法: node scripts/seed-test.mjs
 */
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const PARTS = ['角', '头', '翅膀', '背部', '尾巴', '脖子', '手臂']

const YEARS = [
  { value: 1, label: '百年', attacks: { T1: 302, T2: 274, T3: 247 } },
  { value: 2, label: '千年', attacks: { T1: 372, T2: 338, T3: 305 } },
  { value: 3, label: '万年', attacks: { T1: 438, T2: 398, T3: 358 } },
  { value: 4, label: '三/四万年', attacks: { T1: 509, T2: 462, T3: 416 } },
  { value: 5, label: '五/六/七/八万年', attacks: { T1: 579, T2: 527, T3: 474 } },
]

const PET_NAMES = [
  '测试·赤焰兽',
  '测试·玄冰狐',
  '测试·青木灵',
  '测试·雷霆鸟',
  '测试·黄沙蝎',
  '测试·碧波蛟',
  '测试·紫电狼',
]

const TIERS = ['T1', 'T2', 'T3']

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'wxsh',
    charset: 'utf8mb4',
  })

  let inserted = 0
  let index = 0

  for (const year of YEARS) {
    for (const part of PARTS) {
      for (const tier of TIERS) {
        const petName = `${PET_NAMES[index % PET_NAMES.length]}·${part.slice(0, 1)}`
        index++
        const attack = year.attacks[tier]
        const penetrate = Math.floor(attack * 0.1) + tier.charCodeAt(1) - 48

        await conn.execute(
          `INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [petName, part, attack, penetrate, year.value, tier],
        )
        inserted++
      }
    }
  }

  const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM pet_mutate')
  const [[{ testCount }]] = await conn.query(
    `SELECT COUNT(*) AS testCount FROM pet_mutate WHERE pet_name LIKE '测试·%'`,
  )

  console.log(`[完成] 本次插入测试数据 ${inserted} 条`)
  console.log(`[统计] 测试数据共 ${testCount} 条，表内总计 ${total} 条`)
  console.log('[说明] 宠物名以「测试·」开头，可在管理后台筛选 keyword=测试 后批量删除')

  await conn.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
