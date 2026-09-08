import { Router } from 'express'
import { getMyTickets, cancelTicket } from '../controllers/tickets.controller.js'
import { authenticateCurrent } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/my-tickets', authenticateCurrent, getMyTickets)
router.patch('/:tid/cancel', authenticateCurrent, cancelTicket)

export default router