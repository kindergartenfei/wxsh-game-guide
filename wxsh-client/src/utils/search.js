import { pinyin } from 'pinyin-pro'

const cache = new Map()

function getSearchKeys(text) {
  if (!text) return ''
  if (cache.has(text)) return cache.get(text)
  const py = pinyin(text, { toneType: 'none', type: 'array' }).join('')
  const first = pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' }).join('')
  const keys = `${text}${py}${first}`.toLowerCase()
  cache.set(text, keys)
  return keys
}

export function matchQuery(record, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    record.part,
    record.year,
    ...(record.years || []),
    record.tier,
    String(record.attack),
    record.bio,
    ...splitBioForSearch(record.bio),
  ]
    .map(getSearchKeys)
    .join('|')

  return haystack.includes(q) || haystack.includes(q.replace(/\s/g, ''))
}

function splitBioForSearch(bio) {
  return bio.match(/[\u4e00-\u9fff·]+/g) || []
}
