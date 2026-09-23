import { ERROR_CODES } from '../utils/error-codes.js'

export const errorHandler = (err, req, res, next) => {
    console.error(err) 

    const mapped = ERROR_CODES[err.message]
    if (mapped) {
        const [statusCode, message] = mapped
        return res.status(statusCode).json({ status: 'error', message })
    }

    res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
}