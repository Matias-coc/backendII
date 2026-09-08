import { Router } from 'express'
import { createEvent, getEvents, getEventDetail, updateEvent, changeEventStatus } from '../controllers/events.controller.js'
import { authorizeRoles } from '../middlewares/authorize.middleware.js'
import { authorizeEventOwnerOrAdmin } from '../middlewares/authorizeOwner.middleware.js'
import { createTicket, getEventTickets } from '../controllers/tickets.controller.js'
import { authenticateCurrent } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getEvents)
router.get('/:id', getEventDetail)

router.post(
    '/',
    authenticateCurrent,
    authorizeRoles('organizer', 'admin'),
    createEvent
)

router.put(
    '/:id',
    authenticateCurrent,
    authorizeRoles('organizer', 'admin'),
    authorizeEventOwnerOrAdmin,
    updateEvent
)

router.patch(
    '/:id/status',
    authenticateCurrent,
    authorizeRoles('organizer', 'admin'),
    authorizeEventOwnerOrAdmin,
    changeEventStatus
)

router.post('/:eid/tickets', authenticateCurrent, createTicket)
router.get('/:eid/tickets', authenticateCurrent, getEventTickets)

export default router