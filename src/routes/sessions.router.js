import { Router } from 'express'
import { getSessions } from '../controllers/sessions.controller.js'
import { register } from '../controllers/sessions.controller.js'

const router = Router()

router.get('/', getSessions)
router.post('/register', register)

export default router