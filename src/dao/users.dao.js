import { UserModel } from '../models/User.js'

export const findUserByEmail = (email) => UserModel.findOne({ email })
export const createUser = (userData) => UserModel.create(userData)
export const findUserById = (id) => UserModel.findById(id)
export const findAllUsers = () => UserModel.find()