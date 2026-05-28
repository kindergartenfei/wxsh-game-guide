import { query } from '../db/pool.js'
import { YEAR_MAP, YEAR_LABEL_TO_VALUE } from '../config/index.js'

const TABLE = 'pet_mutate'
const FIELDS =
  'id, pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier'

function enrichRow(row) {
  if (!row) return row
  return {
    ...row,
    pet_year_label: YEAR_MAP[row.pet_year] ?? `未知(${row.pet_year})`,
  }
}

function buildWhere(filters) {
  const conditions = []
  const params = []

  if (filters.keyword) {
    conditions.push('(pet_name LIKE ? OR mutate_part LIKE ?)')
    const kw = `%${filters.keyword}%`
    params.push(kw, kw)
  }
  if (filters.pet_name) {
    conditions.push('pet_name LIKE ?')
    params.push(`%${filters.pet_name}%`)
  }
  if (filters.mutate_part) {
    conditions.push('mutate_part = ?')
    params.push(filters.mutate_part)
  }
  if (filters.pet_year !== undefined && filters.pet_year !== '') {
    conditions.push('pet_year = ?')
    params.push(Number(filters.pet_year))
  }
  if (filters.tier) {
    conditions.push('tier = ?')
    params.push(filters.tier)
  }
  if (filters.min_attack !== undefined && filters.min_attack !== '') {
    conditions.push('attack_value >= ?')
    params.push(Number(filters.min_attack))
  }
  if (filters.max_attack !== undefined && filters.max_attack !== '') {
    conditions.push('attack_value <= ?')
    params.push(Number(filters.max_attack))
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return { where, params }
}

export async function listPets(queryParams) {
  const page = Math.max(1, Number(queryParams.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(queryParams.pageSize) || 20))
  const offset = (page - 1) * pageSize
  const sortBy = ['attack_value', 'penetrate_value', 'pet_year', 'id'].includes(
    queryParams.sortBy,
  )
    ? queryParams.sortBy
    : 'attack_value'
  const sortOrder = queryParams.sortOrder === 'asc' ? 'ASC' : 'DESC'

  const filters = {
    keyword: queryParams.keyword,
    pet_name: queryParams.pet_name,
    mutate_part: queryParams.mutate_part,
    pet_year: queryParams.pet_year,
    min_attack: queryParams.min_attack,
    max_attack: queryParams.max_attack,
  }

  const { where, params } = buildWhere(filters)

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM ${TABLE} ${where}`,
    params,
  )
  const total = countRows[0].total

  // LIMIT/OFFSET 使用已校验的整数拼接，避免 mysql2 预处理参数类型问题
  const rows = await query(
    `SELECT ${FIELDS} FROM ${TABLE} ${where} ORDER BY ${sortBy} ${sortOrder}, id DESC LIMIT ${pageSize} OFFSET ${offset}`,
    params,
  )

  return {
    list: rows.map(enrichRow),
    total,
    page,
    pageSize,
  }
}

export async function getPetById(id) {
  const rows = await query(`SELECT ${FIELDS} FROM ${TABLE} WHERE id = ?`, [id])
  return enrichRow(rows[0])
}

export async function createPet(body) {
  const result = await query(
    `INSERT INTO ${TABLE} (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.pet_name,
      body.mutate_part,
      body.attack_value,
      body.penetrate_value,
      body.pet_year,
      body.tier || 'T1',
    ],
  )
  return getPetById(result.insertId)
}

export async function updatePet(id, body) {
  const fields = []
  const params = []

  for (const key of [
    'pet_name',
    'mutate_part',
    'attack_value',
    'penetrate_value',
    'pet_year',
    'tier',
  ]) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(body[key])
    }
  }

  if (!fields.length) {
    return getPetById(id)
  }

  params.push(id)
  await query(`UPDATE ${TABLE} SET ${fields.join(', ')} WHERE id = ?`, params)
  return getPetById(id)
}

export async function deletePet(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE id = ?`, [id])
  return result.affectedRows > 0
}

export async function batchDelete(ids) {
  if (!ids.length) return 0
  const placeholders = ids.map(() => '?').join(',')
  const result = await query(
    `DELETE FROM ${TABLE} WHERE id IN (${placeholders})`,
    ids,
  )
  return result.affectedRows
}

/** 按部位+年份聚合攻击档位 */
export async function getAttackGroups() {
  const rows = await query(
    `SELECT mutate_part, pet_year, tier, attack_value, penetrate_value,
            COUNT(*) AS pet_count,
            GROUP_CONCAT(pet_name ORDER BY pet_name SEPARATOR '、') AS pets
     FROM ${TABLE}
     GROUP BY mutate_part, pet_year, tier, attack_value, penetrate_value
     ORDER BY attack_value DESC, pet_year DESC, mutate_part`,
  )
  return rows.map((r) => ({
    ...r,
    pet_year_label: YEAR_MAP[r.pet_year] ?? `未知(${r.pet_year})`,
    pets: r.pets ? r.pets.split('、') : [],
  }))
}

/** 前端属性检索卡片列表 */
export async function getArchiveCards() {
  const rows = await query(
    `SELECT mutate_part, pet_year, tier, attack_value, penetrate_value,
            GROUP_CONCAT(pet_name ORDER BY pet_name SEPARATOR '') AS bio,
            GROUP_CONCAT(pet_name ORDER BY pet_name SEPARATOR '、') AS pets_joined,
            COUNT(*) AS pet_count
     FROM ${TABLE}
     GROUP BY mutate_part, pet_year, tier, attack_value, penetrate_value
     ORDER BY attack_value DESC, pet_year DESC, mutate_part`,
  )
  return rows.map((r, index) => ({
    id: index + 1,
    part: r.mutate_part,
    year: YEAR_MAP[r.pet_year] ?? `未知(${r.pet_year})`,
    pet_year: r.pet_year,
    tier: r.tier,
    attack: r.attack_value,
    penetrate: r.penetrate_value,
    bio: r.bio || '',
    pets: r.pets_joined ? r.pets_joined.split('、') : [],
    pet_count: r.pet_count,
  }))
}

/** 元数据：部位列表、年份映射 */
export async function getMeta() {
  const partRows = await query(
    `SELECT DISTINCT mutate_part FROM ${TABLE} ORDER BY mutate_part`,
  )
  const yearRows = await query(
    `SELECT pet_year, COUNT(*) AS count FROM ${TABLE} GROUP BY pet_year ORDER BY pet_year`,
  )

  return {
    parts: partRows.map((r) => r.mutate_part),
    defaultParts: ['角', '头', '翅膀', '背部', '尾巴', '脖子', '手臂'],
    years: yearRows.map((r) => ({
      value: r.pet_year,
      label: YEAR_MAP[r.pet_year] ?? `未知(${r.pet_year})`,
      count: r.count,
    })),
    yearMap: YEAR_MAP,
    yearLabelToValue: YEAR_LABEL_TO_VALUE,
  }
}

export async function getStats() {
  const [summary] = await query(
    `SELECT COUNT(*) AS total,
            COUNT(DISTINCT pet_name) AS pet_types,
            COUNT(DISTINCT mutate_part) AS part_types,
            MAX(attack_value) AS max_attack,
            MIN(attack_value) AS min_attack
     FROM ${TABLE}`,
  )
  const byPart = await query(
    `SELECT mutate_part, COUNT(*) AS count FROM ${TABLE} GROUP BY mutate_part ORDER BY count DESC`,
  )
  const byYear = await query(
    `SELECT pet_year, COUNT(*) AS count FROM ${TABLE} GROUP BY pet_year ORDER BY pet_year`,
  )

  return {
    summary,
    byPart,
    byYear: byYear.map((r) => ({
      ...r,
      label: YEAR_MAP[r.pet_year],
    })),
  }
}
