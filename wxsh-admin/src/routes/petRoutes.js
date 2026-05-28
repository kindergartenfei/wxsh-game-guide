import { Router } from 'express'
import * as petController from '../controllers/petController.js'

const router = Router()

router.get('/meta', petController.meta)
router.get('/stats', petController.stats)
router.get('/attack-groups', petController.attackGroups)
router.get('/cards', petController.archiveCards)
router.post('/batch-delete', petController.batchRemove)

router.get('/', petController.list)
router.get('/:id', petController.detail)
router.post('/', petController.create)
router.put('/:id', petController.update)
router.delete('/:id', petController.remove)

export default router
