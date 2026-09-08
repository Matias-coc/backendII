import passport from 'passport'

export const authenticateCurrent = passport.authenticate('current', { session: false })