/**
 * 将 wxsh-client 静态 records 导入 MySQL
 * 用法: node scripts/import-archive.mjs [--replace]
 */
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') })

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const YEAR_LABEL_TO_VALUE = {
  百年: 1,
  千年: 2,
  万年: 3,
  '三/四万年': 4,
  五万年: 5,
  六万年: 5,
  七万年: 5,
  八万年: 5,
}

const PREFIXES =
  /(?=魅煌·|忱心·|迷蛊·|斓波·|睚眦·|螭吻·|飞廉·|嘲风·|狻猊·|帝江·|飒踏·|凌铄·|莽苍·|冲炎·|青荧·|乘黄·|绵寿·|戾角·|玄煞·|并封·|霹煞·|雳煞·)/

function splitBio(bio) {
  if (!bio) return []
  const parts = bio.split(PREFIXES).filter(Boolean)
  return parts.length ? parts : [bio]
}

async function ensureTierColumn(conn) {
  try {
    await conn.query(
      `ALTER TABLE pet_mutate ADD COLUMN tier VARCHAR(5) NOT NULL DEFAULT 'T1' COMMENT '档位' AFTER pet_year`,
    )
    console.log('[DB] 已添加 tier 字段')
  } catch (e) {
    if (e.code !== 'ER_DUP_FIELDNAME') throw e
  }
}

async function main() {
  const replace = process.argv.includes('--replace')
  const recordsPath = path.join(__dirname, '../../wxsh-client/src/data/records.js')
  const { records } = await import(pathToFileURL(recordsPath).href)

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'wxsh',
    charset: 'utf8mb4',
  })

  await ensureTierColumn(conn)

  if (replace) {
    await conn.query('TRUNCATE TABLE pet_mutate')
    console.log('[DB] 已清空 pet_mutate')
  }

  let inserted = 0
  let skipped = 0

  for (const row of records) {
    const petYear = YEAR_LABEL_TO_VALUE[row.year]
    if (!petYear) {
      console.warn(`跳过未知年份: ${row.year}`, row.id)
      skipped++
      continue
    }

    const names = splitBio(row.bio)
    for (const name of names) {
      const petName = name.trim().slice(0, 50)
      if (!petName) continue
      await conn.execute(
        `INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier)
         VALUES (?, ?, ?, 0, ?, ?)`,
        [petName, row.part, row.attack, petYear, row.tier],
      )
      inserted++
    }
  }

  const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM pet_mutate')
  console.log(`[完成] 本次插入 ${inserted} 条，跳过 ${skipped} 条记录，表内共 ${total} 条`)
  await conn.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
