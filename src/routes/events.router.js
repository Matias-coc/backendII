import { Router } from 'express'
import passport from 'passport'
import { getEvents, createEvent, updateEvent } from '../controllers/events.controller.js'
import { authorizeRoles } from '../middlewares/authorize.middleware.js'
import { authorizeEventOwnerOrAdmin } from '../middlewares/authorizeOwner.middleware.js'

const router = Router()

router.get('/', getEvents)
router.post(
    '/',
    passport.authenticate('current', { session: false }),
    authorizeRoles('organizer', 'admin'),
    createEvent
)
router.put(
    '/:id',
    passport.authenticate('current', { session: false }),
    authorizeRoles('organizer', 'admin'),
    authorizeEventOwnerOrAdmin,
    updateEvent
)
export default router