import { Router } from 'express'
import petRoutes from './petRoutes.js'
import { testConnection } from '../db/pool.js'
import { success, fail } from '../utils/response.js'

const router = Router()

router.get('/health', async (req, res) => {
  try {
    await testConnection()
    return success(res, {
      status: 'ok',
      time: new Date().toISOString(),
    })
  } catch {
    return fail(res, '数据库不可用', 503, 503)
  }
})

router.use('/pets', petRoutes)

export default router
