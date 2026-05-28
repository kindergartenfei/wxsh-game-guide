/** 五～八万年合并为同一「年份」；同部位+档位+攻击合并为一条 */
export const HIGH_YEARS = ['五万年', '六万年', '七万年', '八万年']
export const MERGED_HIGH_YEAR = '五/六/七/八万年'

function mergeBio(a, b) {
  if (!b) return a
  if (!a) return b
  if (a.includes(b) || b.includes(a)) return a.length >= b.length ? a : b
  return a + b
}

export function mergeHighYearRecords(raw) {
  const rest = []
  const groups = new Map()

  for (const r of raw) {
    if (!HIGH_YEARS.includes(r.year)) {
      rest.push({ ...r })
      continue
    }
    const key = `${r.part}|${r.tier}|${r.attack}`
    const existing = groups.get(key)
    if (!existing) {
      groups.set(key, {
        ...r,
        year: MERGED_HIGH_YEAR,
        years: [r.year],
      })
    } else {
      existing.bio = mergeBio(existing.bio, r.bio)
      existing.years.push(r.year)
    }
  }

  const merged = [...groups.values()].map((r, i) => ({
    ...r,
    id: `m${i + 1}`,
    years: [...new Set(r.years)],
  }))

  return [...merged, ...rest].sort((a, b) => {
    if (b.attack !== a.attack) return b.attack - a.attack
    return a.part.localeCompare(b.part, 'zh-CN')
  })
}

export function matchesYearFilter(record, yearFilter) {
  if (!yearFilter) return true
  if (yearFilter === MERGED_HIGH_YEAR) {
    return record.year === MERGED_HIGH_YEAR
  }
  return record.year === yearFilter
}
