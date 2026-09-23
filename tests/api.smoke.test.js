import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/app.js'
import { connectDB } from '../src/config/database.js'

test('flujo completo de la API', async (t) => {
    await connectDB()

    const uniqueEmail = `smoke_${Date.now()}@mail.com`
    let cookie

    await t.test('POST /api/sessions/register crea un usuario', async () => {
        const res = await request(app)
            .post('/api/sessions/register')
            .send({ first_name: 'Smoke', last_name: 'Test', email: uniqueEmail, password: 'Testing123' })
        assert.equal(res.status, 201)
        assert.equal(res.body.status, 'success')
    })

    await t.test('POST /api/sessions/login devuelve cookie de sesión', async () => {
        const res = await request(app)
            .post('/api/sessions/login')
            .send({ email: uniqueEmail, password: 'Testing123' })
        assert.equal(res.status, 200)
        cookie = res.headers['set-cookie']
        assert.ok(cookie)
    })

    await t.test('GET /api/sessions/current devuelve el usuario autenticado', async () => {
        const res = await request(app)
            .get('/api/sessions/current')
            .set('Cookie', cookie)
        assert.equal(res.status, 200)
        assert.equal(res.body.payload.email, uniqueEmail)
    })

    await t.test('GET /api/events responde 200 con paginación', async () => {
        const res = await request(app).get('/api/events')
        assert.equal(res.status, 200)
        assert.ok(Array.isArray(res.body.data))
        assert.ok('total' in res.body)
    })

    await t.test('POST /api/events sin rol organizer/admin responde 403', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Cookie', cookie)
            .send({ title: 'x' })
        assert.equal(res.status, 403)
    })

    await mongoose.connection.close()
})