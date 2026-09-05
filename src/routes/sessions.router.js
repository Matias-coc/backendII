import { Router } from 'express'
import passport from 'passport'
import { getSessions, registerResponse, loginResponse, getCurrentUser, logout, getAllUsers } from '../controllers/sessions.controller.js'
import { authorizeRoles } from '../middlewares/authorize.middleware.js'



const router = Router()

router.get('/', getSessions)
router.post('/register', passport.authenticate('register', { session: false }), registerResponse)
router.post('/login', passport.authenticate('login', { session: false }), loginResponse)
router.get('/current', passport.authenticate('current', { session: false }), getCurrentUser)
router.post('/logout', logout)
router.get('/users', passport.authenticate('current', { session: false }), authorizeRoles('admin'), getAllUsers)


export default router