// controllers/sessions.controller.js
import { registerUser } from '../services/sessions.service.js'

export const getSessions = async (req, res) => {
    try {
        res.json({ message: 'Sessions (pendiente de implementar)' })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener sesiones' })
    }
}

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'La contraseña debe tener al menos 6 caracteres'
            })
        }

        const newUser = await registerUser({ first_name, last_name, email, password })

        res.status(201).json({
            status: 'success',
            payload: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({
                status: 'error',
                message: 'El email ya está registrado'
            })
        }
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
    }
}