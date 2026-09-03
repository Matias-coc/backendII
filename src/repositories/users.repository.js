import { findUserByEmail, createUser } from '../dao/users.dao.js'

export const getUserByEmail = (email) => findUserByEmail(email)
export const saveUser = (userData) => createUser(userData)