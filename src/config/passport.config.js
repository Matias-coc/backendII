import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { getUserByEmail, saveUser, getUserById } from '../repositories/users.repository.js'
import { createHash, isValidPassword } from '../utils/hash.js'


passport.use('register', new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const { first_name, last_name } = req.body

            if (!first_name || !last_name || !email || !password) {
                return done(new Error('MISSING_FIELDS'))
            }

            const normalizedEmail = email.toLowerCase().trim()
            const userExists = await getUserByEmail(normalizedEmail)

            if (userExists) {
                return done(new Error('EMAIL_EXISTS'))
            }

            const hashedPassword = await createHash(password)
            const newUser = await saveUser({
                first_name, last_name, email: normalizedEmail,
                password: hashedPassword, role: 'user'
            })

            return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    }
))


passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const normalizedEmail = email.toLowerCase().trim()
            const user = await getUserByEmail(normalizedEmail)
            if (!user) {
                return done(new Error('INVALID_CREDENTIALS'))
            }

            const validPassword = await isValidPassword(password, user.password)

            if (!validPassword) {
                return done(new Error('INVALID_CREDENTIALS'))
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))


const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies.currentUser
    }
    return token
}

passport.use('current', new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
    async (jwtPayload, done) => {
        try {
            const user = await getUserById(jwtPayload.id)

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' })
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))

export default passport