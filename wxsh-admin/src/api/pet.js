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

export function fetchPetList(params) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) qs.set(k, v)
  })
  return request(`/pets?${qs}`)
}

export function fetchPet(id) {
  return request(`/pets/${id}`)
}

export function createPet(body) {
  return request('/pets', { method: 'POST', body: JSON.stringify(body) })
}

export function updatePet(id, body) {
  return request(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export function deletePet(id) {
  return request(`/pets/${id}`, { method: 'DELETE' })
}

export function batchDeletePets(ids) {
  return request('/pets/batch-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
}

export function fetchStats() {
  return request('/pets/stats')
}
