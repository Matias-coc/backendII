import { Router } from 'express'
import passport from 'passport'
import { getSessions, registerResponse, loginResponse, getCurrentUser, logout } from '../controllers/sessions.controller.js'

const router = Router()

router.get('/', getSessions)
router.post('/register', passport.authenticate('register', { session: false }), registerResponse)
router.post('/login', passport.authenticate('login', { session: false }), loginResponse)
router.get('/current', passport.authenticate('current', { session: false }), getCurrentUser)
router.post('/logout', logout)

export default router