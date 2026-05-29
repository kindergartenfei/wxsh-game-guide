import * as petService from '../services/petService.js'
import { validatePetBody, parseId, parseIds } from '../validators/petValidator.js'
import { success, fail, pageData } from '../utils/response.js'

export async function list(req, res, next) {
  try {
    const result = await petService.listPets(req.query)
    return success(res, pageData(result.list, result.total, result.page, result.pageSize))
  } catch (e) {
    next(e)
  }
}

export async function detail(req, res, next) {
  try {
    const id = parseId(req.params.id)
    if (!id) return fail(res, '无效的 id')

    const row = await petService.getPetById(id)
    if (!row) return fail(res, '记录不存在', 404, 404)

    return success(res, row)
  } catch (e) {
    next(e)
  }
}

export async function create(req, res, next) {
  try {
    const errors = validatePetBody(req.body)
    if (errors.length) return fail(res, errors.join('; '))

    const row = await petService.createPet({
      pet_name: req.body.pet_name.trim(),
      mutate_part: req.body.mutate_part.trim(),
      attack_value: Number(req.body.attack_value),
      penetrate_value: Number(req.body.penetrate_value),
      pet_year: Number(req.body.pet_year),
      tier: req.body.tier || 'T1',
    })
    return success(res, row, '创建成功')
  } catch (e) {
    next(e)
  }
}

export async function update(req, res, next) {
  try {
    const id = parseId(req.params.id)
    if (!id) return fail(res, '无效的 id')

    const existing = await petService.getPetById(id)
    if (!existing) return fail(res, '记录不存在', 404, 404)

    const errors = validatePetBody(req.body, true)
    if (errors.length) return fail(res, errors.join('; '))

    const payload = {}
    if (req.body.pet_name !== undefined) payload.pet_name = String(req.body.pet_name).trim()
    if (req.body.mutate_part !== undefined) payload.mutate_part = String(req.body.mutate_part).trim()
    if (req.body.attack_value !== undefined) payload.attack_value = Number(req.body.attack_value)
    if (req.body.penetrate_value !== undefined)
      payload.penetrate_value = Number(req.body.penetrate_value)
    if (req.body.pet_year !== undefined) payload.pet_year = Number(req.body.pet_year)

    const row = await petService.updatePet(id, payload)
    return success(res, row, '更新成功')
  } catch (e) {
    next(e)
  }
}

export async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id)
    if (!id) return fail(res, '无效的 id')

    const ok = await petService.deletePet(id)
    if (!ok) return fail(res, '记录不存在', 404, 404)

    return success(res, null, '删除成功')
  } catch (e) {
    next(e)
  }
}

export async function batchRemove(req, res, next) {
  try {
    const ids = parseIds(req.body)
    if (!ids) return fail(res, '请提供 ids 数组')

    const count = await petService.batchDelete(ids)
    return success(res, { deleted: count }, `已删除 ${count} 条`)
  } catch (e) {
    next(e)
  }
}

export async function attackGroups(req, res, next) {
  try {
    const data = await petService.getAttackGroups()
    return success(res, data)
  } catch (e) {
    next(e)
  }
}

export async function archiveCards(req, res, next) {
  try {
    const data = await petService.getArchiveCards()
    return success(res, data)
  } catch (e) {
    next(e)
  }
}

export async function meta(req, res, next) {
  try {
    const data = await petService.getMeta()
    return success(res, data)
  } catch (e) {
    next(e)
  }
}

export async function stats(req, res, next) {
  try {
    const data = await petService.getStats()
    return success(res, data)
  } catch (e) {
    next(e)
  }
}
