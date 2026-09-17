import { findUserByEmail, createUser, findUserById, findAllUsers } from '../dao/users.dao.js'


export const getUserByEmail = (email) => findUserByEmail(email)
export const saveUser = (userData) => createUser(userData)
export const getUserById = (id) => findUserById(id)
export const getAllUsersDB = () => findAllUsers()