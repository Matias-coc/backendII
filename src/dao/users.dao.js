import { UserModel } from '../models/User.js'

export const findUserByEmail = (email) => UserModel.findOne({ email })
export const createUser = (userData) => UserModel.create(userData)