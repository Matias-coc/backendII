import { saveEvent, getEventById, getEvents, getEventsCount, saveEventUpdate } from '../repositories/events.repository.js'

export const createEventService = async (eventData, organizerId) => {
    const { title, description, category, date, location, capacity, price, discipline } = eventData

    if (!title || !description || !category || !date || !location) {
        throw new Error('MISSING_FIELDS')
    }

    if (capacity <= 0) {
        throw new Error('INVALID_CAPACITY')
    }

    if (price !== undefined && price < 0) {
        throw new Error('INVALID_PRICE')
    }

    const eventDate = new Date(date)
    if (eventDate <= new Date()) {
        throw new Error('PAST_DATE')
    }

    const newEvent = await saveEvent({
        title, description, category, date: eventDate, location, capacity,
        price: price || 0,
        discipline,
        organizer: organizerId   // nunca viene del body, siempre del usuario autenticado
    })

    return newEvent
}

export const listEventsService = async (queryParams) => {
    const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort = 'date' } = queryParams

    const filter = {}
    if (status) filter.status = status
    if (category) filter.category = category
    if (location) filter.location = { $regex: location, $options: 'i' }

    if (dateFrom || dateTo) {
        filter.date = {}
        if (dateFrom) filter.date.$gte = new Date(dateFrom)
        if (dateTo) filter.date.$lte = new Date(dateTo)
    }

    const pageNumber = Number(page)
    const limitNumber = Math.min(Number(limit) || 10, 50)
    const skip = (pageNumber - 1) * limitNumber

    const events = await getEvents(filter, sort, skip, limitNumber)
    const total = await getEventsCount(filter)

    return {
        data: events,
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
    }
}

export const updateEventService = async (event, updateData) => {
    if (event.status === 'cancelled') {
        throw new Error('EVENT_CANCELLED')
    }

    return await saveEventUpdate(event._id, updateData)
}

export const changeEventStatusService = async (event, newStatus) => {
    const validStatuses = ['draft', 'published', 'cancelled', 'finished']

    if (!validStatuses.includes(newStatus)) {
        throw new Error('INVALID_STATUS')
    }

    if (event.status === 'cancelled') {
        throw new Error('EVENT_CANCELLED')
    }

    return await saveEventUpdate(event._id, { status: newStatus })
}