import { EventModel } from '../models/Event.js'

export const createEventDB = (data) => EventModel.create(data)
export const findEventById = (id) => EventModel.findById(id)
export const findEvents = (filter, sort, skip, limit) =>
    EventModel.find(filter).populate('category').populate('organizer', 'first_name last_name email').sort(sort).skip(skip).limit(limit)
export const countEvents = (filter) => EventModel.countDocuments(filter)
export const updateEventDB = (id, data) => EventModel.findByIdAndUpdate(id, data, { new: true })