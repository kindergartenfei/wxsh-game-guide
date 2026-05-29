import { PARTS, YEAR_MAP } from '../config/index.js'

const VALID_YEARS = new Set(Object.keys(YEAR_MAP).map(Number))

export function validatePetBody(body, partial = false) {
  const errors = []
  const required = partial
    ? []
    : ['pet_name', 'mutate_part', 'attack_value', 'penetrate_value', 'pet_year', 'tier']

  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`${field} 不能为空`)
    }
  }

  if (body.pet_name !== undefined) {
    if (typeof body.pet_name !== 'string' || body.pet_name.length > 50) {
      errors.push('pet_name 长度须在 1～50 字符')
    }
  }

  if (body.mutate_part !== undefined) {
    if (typeof body.mutate_part !== 'string' || body.mutate_part.length > 30) {
      errors.push('mutate_part 长度须在 1～30 字符')
    }
  }

  if (body.attack_value !== undefined) {
    const n = Number(body.attack_value)
    if (!Number.isInteger(n) || n < 0) errors.push('attack_value 须为非负整数')
  }

  if (body.penetrate_value !== undefined) {
    const n = Number(body.penetrate_value)
    if (!Number.isInteger(n) || n < 0) errors.push('penetrate_value 须为非负整数')
  }

  if (body.pet_year !== undefined) {
    const y = Number(body.pet_year)
    if (!VALID_YEARS.has(y)) {
      errors.push(`pet_year 无效，可选: ${[...VALID_YEARS].join(', ')}`)
    }
  }

  if (body.tier !== undefined) {
    if (!['T1', 'T2', 'T3'].includes(body.tier)) {
      errors.push('tier 须为 T1 / T2 / T3')
    }
  }

  return errors
}

export function parseId(id) {
  const n = Number(id)
  if (!Number.isInteger(n) || n < 0) return null
  return n
}

export function parseIds(body) {
  if (!Array.isArray(body.ids)) return null
  const ids = body.ids.map(Number).filter((n) => Number.isInteger(n) && n > 0)
  return ids.length ? ids : null
}
