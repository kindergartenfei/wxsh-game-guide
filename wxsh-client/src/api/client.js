const BASE = import.meta.env.VITE_API_BASE || 'http://8.130.179.156:3000/api'

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const json = await res.json()
  if (json.code !== 0) {
    throw new Error(json.message || '请求失败')
  }
  return json.data
}

/** 属性检索卡片（聚合后） */
export function fetchArchiveCards() {
  return request('/pets/cards')
}
