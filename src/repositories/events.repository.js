import { createEventDB, findEventById, findEvents, countEvents, updateEventDB } from '../dao/events.dao.js'

export const saveEvent = (data) => createEventDB(data)
export const getEventById = (id) => findEventById(id)
export const getEvents = (filter, sort, skip, limit) => findEvents(filter, sort, skip, limit)
export const getEventsCount = (filter) => countEvents(filter)
export const saveEventUpdate = (id, data) => updateEventDB(id, data)